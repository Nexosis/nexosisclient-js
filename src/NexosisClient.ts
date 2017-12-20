import ApiClientBase from './ApiClientBase';
import DataSetClient from './DataSetClient';
import SessionClient from './SessionClient';
import ImportClient from './ImportClient';
import ModelClient from './ModelClient';
import ContestClient from './ContestClient';
import * as es6 from 'es6-promise';
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
                    }
                };
            });
    }

    get DataSets() {
        return new DataSetClient(this._apiConnection);
    }

    get Sessions() {
        return new SessionClient(this._apiConnection);
    }

    get Imports() {
        return new ImportClient(this._apiConnection);
    }

    get Models() {
        return new ModelClient(this._apiConnection);
    }

    get Contests() {
        return new ContestClient(this._apiConnection);
    }
}