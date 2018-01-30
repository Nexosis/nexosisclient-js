import NexosisClient from '../src/NexosisClient';
import { mochaAsync } from './mochaAsync';
import { expect } from 'chai';
import 'mocha';

const testDataSetDetail = require('./fixtures/time-series.json');


describe('Nexosis main client tests', () => {
    let nexosisClient = new NexosisClient({ endpoint: global.endpointUrl, key: process.env.NEXOSIS_API_TESTKEY });
    it('all sub-clients are defined', () => {
        expect(nexosisClient.DataSets).not.to.be.undefined;
        expect(nexosisClient.Imports).not.to.be.undefined;
        expect(nexosisClient.Models).not.to.be.undefined;
        expect(nexosisClient.Sessions).not.to.be.undefined;
        expect(nexosisClient.Contests).not.to.be.undefined;
        expect(nexosisClient.Vocabularies).not.to.be.undefined;
    });

    it('getAccountBalance', mochaAsync(async () => {
        let quotaBalance = await nexosisClient.getAccountBalance();
        expect(quotaBalance.dataSetCount).to.have.a.property('current').that.is.a('number');
        expect(quotaBalance.dataSetCount).to.have.a.property('allotted').that.is.a('number');
        expect(quotaBalance.predictionCount).to.have.a.property('current').that.is.a('number');
        expect(quotaBalance.predictionCount).to.have.a.property('allotted').that.is.a('number');
        expect(quotaBalance.sessionCount).to.have.a.property('current').that.is.a('number');
        expect(quotaBalance.sessionCount).to.have.a.property('allotted').that.is.a('number');
    }));
});