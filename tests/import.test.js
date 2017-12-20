
require('es6-promise').polyfill();
require('isomorphic-fetch');
require('url-search-params-polyfill');
require('babel-regenerator-runtime');

import chai from 'chai';
import ImportClient from '../src/ImportClient';
import mochaAsync from './mochaAsync';

const expect = chai.expect;

describe('Import tests', () => {
    let client = new ImportClient({ endpoint: global.endpointUrl, key: process.env.NEXOSIS_API_TESTKEY });
    let importId;

    it('can submit an import from S3 session', mochaAsync(async () => {
        const result = await client.importFromS3('s3-import-locationa', 'nexosis-sample-data', 'LocationA.csv', 'us-east-1');

        importId = result.importId;
        expect(result.importId).not.to.be.undefined;
    }));

    it('can get import by Id', mochaAsync(async() => {
        const result = await client.get(importId);

        expect(result.dataSetName).to.equal('s3-import-locationa');
    }))

    it('can list imports', mochaAsync(async () => {
        const result = await client.list();

        expect(result.items).not.to.be.empty;
    }));

    it('can list imports by name', mochaAsync(async () => {
        const result = await client.list('s3-import-locationa');

        expect(result.items).not.to.be.empty;
    }));

    it('can list imports by requestedAfterDate', mochaAsync(async () => {
        const result = await client.list('', '1-01-2017');

        expect(result.items).not.to.be.empty;
    }));

    it('can list imports by requestedBeforeDate', mochaAsync(async () => {
        const result = await client.list('', '', '1-01-2100');

        expect(result.items).not.to.be.empty;
    }));
});
