require('isomorphic-fetch');
const chai = require('chai');
const expect = chai.expect;

import NexosisClient from '../src/NexosisClient';

describe('client tests', () => {
    var client = new NexosisClient({ endpoint: global.endpointUrl, key: process.env.NEXOSIS_API_TESTKEY });
    it('can get account balance', (done) => {
        client.getAccountBalance().then(value => {
            expect(value).to.match(/^\d+\.\d{2} USD$/);
        }).then(done)
            .catch((err) => { done(err); });;
    });
})