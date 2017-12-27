import DataSetClient from '../src/DataSetClient';
import { mochaAsync } from './mochaAsync';
import { expect } from 'chai';
import 'mocha';

const testDataSetDetail = require('./fixtures/time-series.json');

describe('DataSet tests', () => {
    let client = new DataSetClient({ endpoint: global.endpointUrl, key: process.env.NEXOSIS_API_TESTKEY });

    after(function () {
        client.remove("testJavascript");
    });

    it('can create dataset', done => {
        client.create('testJavascript', testDataSetDetail).then((data) => {
            expect(data.dataSetName).to.equal('testJavascript');
        }).then(done)
            .catch((err) => { done(err); });
    });

    it('should find dataset', done => {
        client.get('testJavascript').then(ds => {
            expect(ds.dataSetName).to.equal('testJavascript');
        }).then(done)
            .catch((err) => done(err));
    });

    it('should list datasets', done => {
        client.list('test').then(data => {
            expect(data.items).to.not.equal(0);
        }).then(done)
            .catch((err) => done(err));
    });
});