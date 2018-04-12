import ApiClientBase from './ApiClientBase';
import DataSetClient from './DataSetClient';
import SessionClient from './SessionClient';
import ImportClient from './ImportClient';
import ModelClient from './ModelClient';
import ContestClient from './ContestClient';
import * as es6 from 'es6-promise';
import VocabularyClient from './VocabularyClient';
(es6 as any).polyfill();


/**
 * Main class used to access features of the Nexosis API.
 */
export default class NexosisClient extends ApiClientBase {
    getAccountBalance(transformFunc) {
        return this._apiConnection.getHeaders('data?page=0&pageSize=1', transformFunc)
            .then(headers => {
                return {
                    dataSetCount: {
                        current: parseInt(headers.get('nexosis-account-datasetcount-current'), 10),
                        allotted: parseInt(headers.get('nexosis-account-datasetcount-allotted'), 10)
                    },
                    predictionCount: {
                        current: parseInt(headers.get('nexosis-account-predictioncount-current'), 10),
                        allotted: parseInt(headers.get('nexosis-account-predictioncount-allotted'), 10),
                    },
                    sessionCount: {
                        current: parseInt(headers.get('nexosis-account-sessioncount-current'), 10),
                        allotted: parseInt(headers.get('nexosis-account-sessioncount-allotted'), 10)
                    },
                    dataSetSize: {
                        allotted: parseInt(headers.get('nexosis-account-datasetsize-allotted'), 10)
                    }
                };
            });
    }

    private _dataSetClient;
    private _contests;
    private _sessions;
    private _imports;
    private _models;
    private _vocabularies;

    get DataSets(): DataSetClient {
        if (!this._dataSetClient) {
            return this._dataSetClient = new DataSetClient(this._apiConnection);
        }
        return this._dataSetClient;
    }

    get Sessions(): SessionClient {
        if (!this._sessions) {
            return this._sessions = new SessionClient(this._apiConnection);
        }
        return this._sessions;
    }

    get Imports(): ImportClient {
        if (!this._imports) {
            return this._imports = new ImportClient(this._apiConnection);
        }
        return this._imports;
    }

    get Models(): ModelClient {
        if (!this._models) {
            return this._models = new ModelClient(this._apiConnection);
        }
        return this._models;
    }

    get Contests(): ContestClient {
        if (!this._contests) {
            return this._contests = new ContestClient(this._apiConnection);
        }
        return this._contests;
    }

    get Vocabularies(): VocabularyClient {
        if (!this._vocabularies) {
            return this._vocabularies = new VocabularyClient(this._apiConnection);
        }
        return this._contests;
    }
}