import DataSetClient from '../src/DataSetClient';
import ViewClient from '../src/ViewClient'
import { mochaAsync } from './mochaAsync';
import { expect } from 'chai';
import 'mocha';

const testDataSetDetail = require('./fixtures/time-series.json');

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

    it('can create view', mochaAsync(async () => {

        var view = {
            dataSetName: "testJavascriptViewDataset"
        };

        const data = await client.create('testJavascriptView', view);
        expect(data.viewName).to.equal('testJavascriptView')
    }));

    it('can create view with joins', mochaAsync(async () => {

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

        const data = await client.create('testJavascriptViewJoins', view);
        expect(data.viewName).to.equal('testJavascriptViewJoins');
        expect(data.joins[0].dataSet.name).to.equal("testJavascriptViewDataset2");
    }));


    it('can get view data', mochaAsync(async () => {

        var view = {
            dataSetName: "testJavascriptViewDataset"
        };

        await client.create('testJavascriptView', view);
        const results = await client.get('testJavascriptView');
        expect(results.viewName).to.equal('testJavascriptView');
        expect(results.data.length).to.be.greaterThan(0);
        
    }));

    it('should list views', mochaAsync(async () => {
        const data = await client.list();
        expect(data.items).to.not.equal(0);
    }));
});