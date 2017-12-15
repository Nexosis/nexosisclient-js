require('es6-promise').polyfill();
require('isomorphic-fetch');
require('url-search-params-polyfill');

const chai = require('chai');
const expect = chai.expect;
const testDataSetDetail = require('./fixtures/time-series.json');

import DataSetClient from '../src/DataSetClient';

describe('DataSet tests', () => {
    let client = new DataSetClient({ endpoint: global.endpointUrl, key: process.env.NEXOSIS_API_TESTKEY });

    after(function () {
        client.remove("testJavascript");
    });

    it('can create dataset', (done) => {
        client.create('testJavascript', testDataSetDetail).then((data) => {
            expect(data.dataSetName).to.equal('testJavascript');
        }).then(done)
            .catch((err) => { done(err); });
    });

    it('should find dataset', (done) => {
        client.get('testJavascript').then((ds) => {
            expect(ds.dataSetName).to.equal('testJavascript');
        }).then(done)
            .catch((err) => done(err));
    });

    it('should find dataset with transform', (done) => {
        client.get('testJavascript', null, null, 0, 50, [], (data) => { return data.dataSetName; }).then((str) => {
            expect(str).to.equal('testJavascript');
        }).then(done)
            .catch((err) => done(err));
    });

    it('should list datasets', (done) => {
        client.list('test').then((data) => {
            expect(data.items).to.not.equal(0);
        }).then(done)
            .catch((err) => done(err));
    });
});