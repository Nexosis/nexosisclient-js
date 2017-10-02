require('es6-promise').polyfill();
require('isomorphic-fetch');
require('url-search-params-polyfill');

const chai = require('chai');
const expect = chai.expect;
const testDataSetDetail = require('./fixtures/time-series.json');

import DataSetClient from '../src/DataSetClient';
import ViewClient from '../src/ViewClient'

describe('View tests', function () {
    let client = new ViewClient({ endpoint: global.endpointUrl, key: process.env.NEXOSIS_API_TESTKEY });
    let dataSetClient = new DataSetClient({ endpoint: global.endpointUrl, key: process.env.NEXOSIS_API_TESTKEY });
    this.timeout(5000);

    before(function (done) {

        var dataSets = [
            () => { return dataSetClient.create('testJavascriptViewDataset', testDataSetDetail) },
            () => { return dataSetClient.create('testJavascriptViewDataset2', testDataSetDetail) },
        ];

        dataSets.reduce((prev, cur) => { return prev.then(cur) }, Promise.resolve())
            .then(() => done())
            .catch(err => done(err));
    });

    after(function (done) {
        var removePromises = [
            () => { return client.remove("testJavascriptView") },
            () => { return client.remove("testJavascriptViewJoins") },
            () => { return dataSetClient.remove("testJavascriptViewDataset") },
            () => { return dataSetClient.remove("testJavascriptViewDataset2") }
        ];

        removePromises.reduce((prev, cur) => { return prev.then(cur) }, Promise.resolve())
            .then(() => done())
            .catch(err => done(err));
    });

    it('can create view', () => {

        var view = {
            dataSetName: "testJavascriptViewDataset"
        };

        return client.create('testJavascriptView', view).then((data) => {
            expect(data.viewName).to.equal('testJavascriptView');
        });
    });

    it('can create view with joins', () => {

        var view = {
            dataSetName: "testJavascriptViewDataset",
            joins: [
                {
                    dataSet: {
                        name: "testJavascriptViewDataset2"
                    }
                }
            ]
        };

        return client.create('testJavascriptViewJoins', view).then((data) => {
            expect(data.viewName).to.equal('testJavascriptViewJoins');
            expect(data.joins[0].dataSet.name).to.equal("testJavascriptViewDataset2");
        }).catch(err => {
            console.log(err);
        });
    });


    it('can get view data', () => {

        var view = {
            dataSetName: "testJavascriptViewDataset"
        };

        return client.create('testJavascriptView', view).then(returnedView => {
            return client.get('testJavascriptView');
        }).then(results => {
            expect(results.viewName).to.equal('testJavascriptView');
            expect(results.data.length).to.be.greaterThan(0)
        });
    });

    it('should list views', (done) => {
        client.list().then((data) => {
            expect(data.items).to.not.equal(0);
        }).then(done)
            .catch((err) => done(err));
    });
});