import VocabularyClient from '../src/VocabularyClient';
import { mochaAsync } from './mochaAsync';
import { expect } from 'chai';
import 'mocha';

describe('Vocabulary tests', function () {
    let client = new VocabularyClient({ endpoint: global.endpointUrl, key: process.env.NEXOSIS_API_TESTKEY });
    this.timeout(5000);

    it('can list vocabularies', () => {
        return client.list().then((data) => {
            expect(data.items.length).to.be.greaterThan(0);
        });
    });

    it('can query vocabularies by session id', () => {
        return client.list({createdFromSession: "0160fb8f-de87-418c-8ef3-f1a479767437"}).then((data) => {
            expect(data.items.length).to.be.greaterThan(0);
            for(var item of data.items) {
                expect(item.createdBySessionId).to.be.equal("0160fb8f-de87-418c-8ef3-f1a479767437")
            }
        });
    });

    it('can query vocabularies by data source', () => {
        return client.list({dataSource: "Axon.Api.Verification.Regression_Airline"}).then((data) => {
            expect(data.items.length).to.be.greaterThan(0);
            for(var item of data.items) {
                expect(item.dataSourceName).to.be.equal("Axon.Api.Verification.Regression_Airline")
            }
        });
    });

    it('can get words for a vocabulary', () => {
        return client.get("9a6a4bf0-e85c-41bc-b3b9-76f7bba81f39").then((data) => {
            expect(data.id).to.be.equal("9a6a4bf0-e85c-41bc-b3b9-76f7bba81f39")
            expect(data.items.length).to.be.greaterThan(0);
        });
    });

    it('can filter words by type', () => {
        return client.get("9a6a4bf0-e85c-41bc-b3b9-76f7bba81f39", {type: 'word'}).then((data) => {
            expect(data.id).to.be.equal("9a6a4bf0-e85c-41bc-b3b9-76f7bba81f39")
            for(var word of data.items) {
                expect(word.type).to.be.equal("word")
            }
        });
    });
  
    
});