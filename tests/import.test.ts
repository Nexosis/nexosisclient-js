import ImportClient from '../src/ImportClient';
import { mochaAsync } from './mochaAsync';
import { expect } from 'chai';
import 'mocha';

describe('Import tests', () => {
    let client = new ImportClient({ endpoint: global.endpointUrl, key: process.env.NEXOSIS_API_TESTKEY });
    let importId;

    it('can submit an import from S3 session', mochaAsync(async () => {
        const result = await client.importFromS3('s3-import-locationa', 'nexosis-sample-data', 'LocationA.csv', 'us-east-1');

        importId = result.importId;
        expect(result.importId).not.to.be.undefined;
    }));

    it('can submit imports from url', mochaAsync(async () => {
        const result = await client.importFromUrl('url-import',
            'https://raw.githubusercontent.com/Nexosis/sampledata/master/LocationA.csv',
            { userId: 'user', password: 'pass' });

        expect(result.importId).not.to.be.undefined;
    }));

    it('can submit imports from azure', mochaAsync(async () => {
        const result = await client.importFromAzure('azure-import',
            'BlobEndpoint=https://myblobendpoint.blob.core.windows.net/', 'mycontainer', 'mydatafile.json');

        expect(result.importId).not.to.be.undefined;
    }));

    it('can get import by Id', mochaAsync(async () => {
        const result = await client.get(importId);

        expect(result.dataSetName).to.equal('s3-import-locationa');
    }))

    it('can list imports', mochaAsync(async () => {
        const result = await client.list();

        expect(result.items).not.to.be.empty;
    }));

    it('can list imports by name', mochaAsync(async () => {
        const result = await client.list({ dataSetName: 's3-import-locationa' });

        expect(result.items).not.to.be.empty;
    }));

    it('can list imports by requestedAfterDate', mochaAsync(async () => {
        const result = await client.list({ requestedAfterDate: '1-01-2017' });

        expect(result.items).not.to.be.empty;
    }));

    it('can list imports by requestedBeforeDate', mochaAsync(async () => {
        const result = await client.list({ requestedBeforeDate: '1-01-2100' });

        expect(result.items).not.to.be.empty;
    }));

    it('can filter import lists using dates', mochaAsync(async () => {
        const result = await client.list({
            requestedAfterDate: new Date('01-01-2017 UTC'),
            requestedBeforeDate: new Date('01-01-2100 UTC')
        });

        expect(result.items).not.to.be.empty;
    }));
});
