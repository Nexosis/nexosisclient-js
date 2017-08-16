require('es6-promise').polyfill();
require('isomorphic-fetch');
require('url-search-params-polyfill');

const chai = require('chai');
const expect = chai.expect;
const testDataSetDetail = require('./dataGenerator');


import DataSetClient from '../src/DataSetClient';
import ViewClient from '../src/ViewClient'


describe('View tests', () => {
    let client = new ViewClient({ endpoint: process.env.NEXOSIS_API_TESTURI, key: process.env.NEXOSIS_API_TESTKEY });
    let dataSetClient = new DataSetClient({ endpoint: process.env.NEXOSIS_API_TESTURI, key: process.env.NEXOSIS_API_TESTKEY });

    before(function() {

        var dataSets = [
            dataSetClient.create('testJavascript', testDataSetDetail),            
            dataSetClient.create('testJavascript2', testDataSetDetail),
        ];

        return Promise.all(dataSets);//.then(res=> {done()}).catch((err) => { done(err); });

    });

    after(function() {
        client.remove("testJavascriptView");
        dataSetClient.remove("testJavascript");
        dataSetClient.remove("testJavascript2");
    });

    it('can create view', () => {

        var view = {
            dataSetName : "testJavascript"
        };

        return client.create('testJavascriptView', view).then((data) => {
                expect(data.viewName).to.equal('testJavascriptView');
            });
    });

    it('can create view with joins', () => {

        var view = {
            dataSetName : "testJavascript",
            joins : [
                {
                    dataSet : {
                        name : "testJavascript2"
                    }
                }
            ]
        };

        return client.create('testJavascriptViewJoins', view).then((data) => {
                expect(data.viewName).to.equal('testJavascriptViewJoins');
                expect(data.joins[0].dataSet.name).to.equal("testJavascript2");
            });
    });

    
    it('can get view data', () => {

        var view = {
            dataSetName : "testJavascript"
        };

        return client.create('testJavascriptview', view).then(returnedView=> {
            return client.get('testJavscriptview');
        }).then(results=> {
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