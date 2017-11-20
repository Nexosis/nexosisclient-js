require('es6-promise').polyfill();
require('isomorphic-fetch');
require('url-search-params-polyfill');

const chai = require('chai');
const expect = chai.expect;
const testDataSetDetail = require('./fixtures/time-series.json');

import SessionClient from '../src/SessionClient';
import DataSetClient from '../src/DataSetClient';

describe('Session tests', () => {
    var client = new SessionClient({ endpoint: global.endpointUrl, key: process.env.NEXOSIS_API_TESTKEY });
    var dataClient = new DataSetClient({ endpoint: global.endpointUrl, key: process.env.NEXOSIS_API_TESTKEY });
    before(function (done) {
        dataClient.create("TestNode", { "data": [{ "timestamp": "1-1-2017", "sales": 135.32 }, { "timestamp": "1-2-2017", "sales": 235.31 }, { "timestamp": "1-3-2017", "sales": 335.42 }, { "timestamp": "1-04-2017", "sales": 65.98 }, { "timestamp": "1-05-2017", "sales": 255.23 }] })
            .then(response => { })
            .then(done, done);
    });

    after(function (done) {
        dataClient.remove("TestNode").then(() => done()).catch(err => done(err));
    });

    it('can create an impact session', (done) => {
        var result = client.analyzeImpact("TestNode", '1-03-2017', '1-05-2017', 'myevent', 'sales');
        expect(result).to.be.a('Promise');
        result.then((data) => {
            expect(data.dataSetName).to.equal('TestNode');
        }).then(done)
            .catch((err) => { done(err); });
    });

    it('can create an forecast session', (done) => {
        var result = client.createForecast("TestNode", '1-06-2017', '1-07-2017', 'sales');
        expect(result).to.be.a('Promise');
        result.then((data) => {
            expect(data.dataSetName).to.equal('TestNode');
        }).then(done)
            .catch((err) => { done(err); });
    });

    it('can get results by interval', (done) => {
        client.list().then(function (value) {
            var existing = null;
            for (var index = 0; index < value.items.length; index++) {
                var session = value.items[index];
                if (session.status === "completed" && session.type === "forecast") {
                    existing = session;
                    break;
                }
            }
            var result = client.resultsByInterval(existing.sessionId, existing.availablePredictionIntervals[0]);
            result.then((session_result) => {
                expect(session_result.data).not.toBeNull();
            }).then(done)
        }).then(done)
            .catch((err) => { done(err); });;
    });

    it('can get confusion matrix', (done) => {
        client.list().then(function (value) {
            var existing = null;
            for (var index = 0; index < value.items.length; index++) {
                var session = value.items[index];
                if (session.status === "completed" && session.type === "model" && session.predictionDomain.toLowerCase() === "classification") {
                    existing = session;
                    break;
                }
            }
            var result = client.confusionMatrixResults(existing.sessionId);
            result.then((classResult) => {
                expect(classResult.confusionMatrix).not.toBeNull();
            })
        }).then(done)
            .catch((err) => { done(err); });;
    });
});