import SessionClient from '../src/SessionClient';
import DataSetClient from '../src/DataSetClient';
import { SortOrder } from '../src/Types';
import { mochaAsync, sleep, isComplete } from './mochaAsync';
import { expect } from 'chai';
import 'mocha';

const testDataSetDetail = require('./fixtures/time-series.json');
const housingData = require('./fixtures/housing-data.json');

describe('Session tests', () => {
    var client = new SessionClient({ endpoint: global.endpointUrl, key: process.env.NEXOSIS_API_TESTKEY });
    var dataClient = new DataSetClient({ endpoint: global.endpointUrl, key: process.env.NEXOSIS_API_TESTKEY });
    let forecastSessionId;

    before(function (done) {
        var dataSets = [
            () => { return dataClient.create('TestNode', testDataSetDetail) },
            () => { return dataClient.create('SessionHousingData', housingData) },
        ];

        dataSets.reduce((prev, cur) => { return prev.then(cur) }, Promise.resolve())
            .then(() => done())
            .catch(err => done(err));
    });

    after(function (done) {
        let removePromises = [
            () => { return dataClient.remove('TestNode') },
            () => { return dataClient.remove('SessionHousingData') }
        ];

        removePromises.reduce((prev, cur) => { return prev.then(cur) }, Promise.resolve())
            .then(() => done())
            .catch(err => done(err));
    });

    it('can create an impact session', mochaAsync(async () => {
        var result = await client.analyzeImpact('TestNode', '06-01-2017', '06-05-2017', 'myevent', 'es6-client');
        expect(result.dataSetName).to.equal('TestNode');
    }));

    it('can create an impact session with options object', mochaAsync(async () => {
        var result = await client.analyzeImpact({
            dataSourceName: 'TestNode',
            startDate: '06-01-2017',
            endDate: '06-05-2017',
            eventName: 'myevent',
            targetColumn: 'es6-client'
        });

        expect(result.dataSetName).to.equal('TestNode');
    }));

    it('can create a forecast session', mochaAsync(async () => {
        var result = await client.createForecast("TestNode", '06-29-2017', '07-15-2017', 'es6-client');
        forecastSessionId = result.sessionId;

        expect(result.dataSetName).to.equal('TestNode');
    }));

    it('can create a forecast session with options object', mochaAsync(async () => {
        var result = await client.createForecast({
            dataSourceName: 'TestNode',
            startDate: '06-29-2017',
            endDate: '07-15-2017',
            targetColumn: 'es6-client'
        });

        expect(result.dataSourceName).to.equal('TestNode');
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
        var existing =
            value.items
                .filter(session => session.status === 'completed' && session.type === 'model' && session.predictionDomain.toLowerCase() === 'classification')
                .reverse()[0];

        const matrixResult = await client.confusionMatrixResults(existing.sessionId);
        expect(matrixResult.confusionMatrix).not.to.be.null;
    }));

    it('can list sessions using parameters', mochaAsync(async () => {
        const result = await client.list({ dataSourceName: 'TestNode', eventName: 'myevent', requestedAfterDate: '01-01-2017', requestedBeforeDate: '01-01-2100' });

        expect(result.items).not.to.be.empty;
    }));

    it('can start an anomaly model session', mochaAsync(async () => {
        const result = await client.trainModel({ dataSourceName: 'TestNode', predictionDomain: 'anomalies', extraParameters: { containsAnomalies: true } });

        expect(result.dataSetName).to.equal('TestNode');
    }));

    it('can sort session list by date', mochaAsync(async () => {
        const result = await client.list({ dataSourceName: 'TestNode', eventName: 'myevent', sortBy: 'requestedDate', sortOrder: 'asc'});

        expect(result.items).not.to.be.empty;
    }));

    it('can start a classification model session', mochaAsync(async () => {
        const result = await client.trainModel(
            {
                dataSourceName: 'SessionHousingData',
                predictionDomain: 'classification',
                extraParameters: { balance: true },
                columnMetadata: {
                    'OverallQual': {
                        role: 'target'
                    }
                }
            });
        expect(result.dataSetName).to.equal('SessionHousingData');

        let status = await client.status(result.sessionId);

        while (!isComplete(status)) {
            status = await client.status(result.sessionId);
            await sleep(30000);
        }

        const scoreResults = await client.classScoreResults(result.sessionId);

        expect(scoreResults.metrics).to.have.property('macroAverageF1Score').that.is.a('number');

    })).timeout(900000);
});