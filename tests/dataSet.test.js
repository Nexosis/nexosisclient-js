require('es6-promise').polyfill();
require('isomorphic-fetch');
require('url-search-params-polyfill');

const chai = require('chai');
const expect = chai.expect;
const testDataSetDetail = require('./dataGenerator');


import DataSetClient from '../src/DataSetClient';

describe('Polyfill tests', () => {
    it('can use url search params', (done) => {
        var parameters = { partialName: 'es' };
        var urlParams = new URLSearchParams();
        Object.keys(parameters).forEach((p) => urlParams.append(p, parameters[p]));
        expect(urlParams.toString()).to.equal('partialName=es');
        urlParams.append('startDate', '2017-06-29');
        expect(urlParams.toString()).to.equal('partialName=es&startDate=2017-06-29');
        done();
    });
});

describe('DataSet tests', () => {
    let client = new DataSetClient({ endpoint: process.env.NEXOSIS_API_TESTURI, key: process.env.NEXOSIS_API_TESTKEY });

    after(function() {
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
        client.get('testJavascript', null, null, 0, 30, [], (data) => { return data.dataSetName; }).then((str) => {
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