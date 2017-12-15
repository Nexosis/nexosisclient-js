require('es6-promise').polyfill();
require('isomorphic-fetch');
require('url-search-params-polyfill');

const mochaAsync = require('./mochaAsync');
const chai = require('chai');
const expect = chai.expect;
const testDataSetDetail = require('./fixtures/time-series.json');

import SessionClient from '../src/SessionClient';
import DataSetClient from '../src/DataSetClient';

describe('Session tests', () => {
    var client = new SessionClient({ endpoint: global.endpointUrl, key: process.env.NEXOSIS_API_TESTKEY });
    var dataClient = new DataSetClient({ endpoint: global.endpointUrl, key: process.env.NEXOSIS_API_TESTKEY });
    let forecastSessionId;

    before(function (done) {
        dataClient.create("TestNode", testDataSetDetail)
            .then(response => { })
            .then(done, done);
    });

    after(function (done) {
        dataClient.remove("TestNode").then(() => done()).catch(err => done(err));
    });

    it('can create an impact session', mochaAsync(async () => {
        var result = await client.analyzeImpact("TestNode", '06-01-2017', '06-05-2017', 'myevent', 'es6-client');
        expect(result.dataSetName).to.equal('TestNode');
    }));

    it('can create an forecast session', mochaAsync(async () => {
        var result = await client.createForecast("TestNode", '06-29-2017', '07-15-2017', 'es6-client');
        forecastSessionId = result.sessionId;

        expect(result.dataSetName).to.equal('TestNode');
    }));

    it('can delete sessions', mochaAsync(async () => {
        var result = await client.remove(forecastSessionId);

        expect(result.status).to.equal(204);
    }));

    it('can get results', mochaAsync(async () => {
        const value = await client.list();
        var existing =
            value.items
                .filter(session => session.status === 'completed' && session.type === 'forecast')[0];

        var session_result = await client.results(existing.sessionId);
        expect(session_result.data).not.to.be.empty;
    }));

    it('can get results by interval', mochaAsync(async () => {
        const value = await client.list();
        var existing =
            value.items
                .filter(session => session.status === 'completed' && session.type === 'forecast')
                .reverse()[0];

        var session_result = await client.resultsByInterval(existing.sessionId, existing.availablePredictionIntervals[0]);
        expect(session_result.data).not.to.be.null;
    }));

    it('can get confusion matrix', mochaAsync(async () => {
        const value = await client.list();
        var existing = null;

        for (var index = 0; index < value.items.length; index++) {
            var session = value.items[index];
            if (session.status === "completed" && session.type === "model" && session.predictionDomain.toLowerCase() === "classification") {
                existing = session;
                break;
            }
        }
        const matrixResult = await client.confusionMatrixResults(existing.sessionId);
        expect(matrixResult.confusionMatrix).not.to.be.null;
    }));

    it('can list sessions using parameters', mochaAsync(async () => {
        const result = await client.list('TestNode', 'myevent', '01-01-2017', '01-01-2100');

        expect(result.items).not.to.be.empty;
    }));
});