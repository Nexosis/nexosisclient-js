require('es6-promise').polyfill();
require('isomorphic-fetch');
require('url-search-params-polyfill');

const mochaAsync = require('./mochaAsync');
const chai = require('chai');
const expect = chai.expect;
const testDataSetDetail = require('./fixtures/time-series.json');

import NexosisClient from '../src/NexosisClient';

describe('Nexosis main client tests', () => {
    let nexosisClient = new NexosisClient({ endpoint: global.endpointUrl, key: process.env.NEXOSIS_API_TESTKEY });
    it('all sub-clients are defined', () => {
        expect(nexosisClient.DataSets).not.to.be.undefined;
        expect(nexosisClient.Imports).not.to.be.undefined;
        expect(nexosisClient.Models).not.to.be.undefined;
        expect(nexosisClient.Sessions).not.to.be.undefined;
    });

    it('getAccountBalance', mochaAsync(async () => {
        let quotaBalance = await nexosisClient.getAccountBalance();
        console.log(quotaBalance);
        expect(quotaBalance.dataSetCount).to.have.a.property('current').that.is.a('number');
        expect(quotaBalance.dataSetCount).to.have.a.property('allotted').that.is.a('number');
        expect(quotaBalance.predictionCount).to.have.a.property('current').that.is.a('number');
        expect(quotaBalance.predictionCount).to.have.a.property('allotted').that.is.a('number');
        expect(quotaBalance.sessionCount).to.have.a.property('current').that.is.a('number');
        expect(quotaBalance.sessionCount).to.have.a.property('allotted').that.is.a('number');
    }));
});