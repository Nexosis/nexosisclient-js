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
            requestedAfterDate: new Date(2017, 1, 1),
            requestedBeforeDate: new Date(2100, 1, 1)
        });

        expect(result.items).not.to.be.empty;
    }));
});
