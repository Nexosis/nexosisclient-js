import NexosisClient from '../src/NexosisClient';
import { mochaAsync } from './mochaAsync';
import { expect } from 'chai';
import 'mocha';

const testDataSetDetail = require('./fixtures/time-series.json');

describe('transform function tests', () => {
    let nexosisClient = new NexosisClient({ endpoint: global.endpointUrl, key: process.env.NEXOSIS_API_TESTKEY });
    let request;
    let response;

    const transform = (req, resp) => {
        if (resp) {
            response = resp;
        } else {
            request = req;
            return request;
        }
    }

    before(mochaAsync(async () => {
        await nexosisClient.DataSets.create('testJavascript', testDataSetDetail);
    }));

    beforeEach(function () {
        request = undefined;
        response = undefined;
    });

    after(mochaAsync(async () => {
        await nexosisClient.DataSets.remove("testJavascript");
    }));

    it('allow access to a response object', mochaAsync(async () => {
        let dataSetName;
        const getNameTransform = (req, resp) => {
            if (resp) {
                resp.json().then(json => {
                    dataSetName = json.dataSetName;
                });
            } else {
                request = req;
                return request;
            }
        };

        nexosisClient.DataSets.FetchTransformFunction = getNameTransform;
        await nexosisClient.DataSets.get('testJavascript');
        expect(dataSetName).to.equal('testJavascript');
        expect(request.url).to.include(global.endpointUrl + '/data/testJavascript');
    }));

    it('should allow modification of a request', mochaAsync(async () => {
        const changeMethod = (req, resp) => {
            if (resp) {
                response = resp;
            } else {
                return new Request(global.endpointUrl + '/data/differentDataset', {
                    method: req.method,
                    headers: req.headers,
                    body: req.body,
                    referrer: req.referrer,
                    referrerPolicy: req.referrerPolicy,
                    mode: req.mode,
                    credentials: req.credentials,
                    cache: req.cache,
                    redirect: req.redirect,
                    integrity: req.integrity
                });
            }
        };

        nexosisClient.DataSets.FetchTransformFunction = changeMethod;
        await nexosisClient.DataSets.create('testJavascript', testDataSetDetail);
        expect(response.url).to.include(global.endpointUrl + '/data/differentDataset');
        await nexosisClient.DataSets.remove('differentDataset');
    }));

    it('should transform on a put', mochaAsync(async () => {
        nexosisClient.DataSets.FetchTransformFunction = transform;
        await nexosisClient.DataSets.create('testJavascript', testDataSetDetail);
        expect(request.url).to.include(global.endpointUrl + '/data/testJavascript');
        expect(request.method).to.equal('PUT');
        expect(response.status).to.equal(201);
    }));

    it('should run transform on a delete', mochaAsync(async () => {
        nexosisClient.DataSets.FetchTransformFunction = transform;
        await nexosisClient.DataSets.remove('testJavascript', { startDate: '2000-01-01' });
        expect(request.url).to.include(global.endpointUrl + '/data/testJavascript')
        expect(request.method).to.equal('DELETE');
        expect(response.status).to.equal(204);
    }));

    it('should run transform on post', done => {
        nexosisClient.Models.FetchTransformFunction = transform;
        nexosisClient.Models.predict('id', [])
            .then(() => { done('should not succeed'); })
            .catch(() => {
                expect(request.url).to.include(global.endpointUrl + '/models/id');
                expect(request.method).to.equal('POST');
                done();
            });
    });

    it('should run transform on head', done => {
        nexosisClient.Sessions.FetchTransformFunction = transform;
        nexosisClient.Sessions.status('id')
            .then(() => { done('should not succeed'); })
            .catch(() => {
                expect(request.url).to.include(global.endpointUrl + '/sessions/id');
                expect(request.method).to.equal('HEAD');
                done();
            });
    });

    it('should run transform on headers request', mochaAsync(async () => {
        await nexosisClient.getAccountBalance(transform);
        expect(request.url).to.include(global.endpointUrl + '/data');
        expect(request.method).to.equal('GET');
        expect(response.status).to.equal(200);
    }));

});
