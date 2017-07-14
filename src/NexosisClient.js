import ApiClientBase from './ApiClientBase';
import DataSetClient from './DataSetClient';
import SessionClient from './SessionClient';
import ImportClient from './ImportClient';
import Promise from "es6-promise";
import "isomorphic-fetch";

Promise.polyfill();
/**
 * Main class used to access features of the Nexosis API.
 */
export default class NexosisClient extends ApiClientBase {
    getAccountbalance(transformFunc) {
        return this._apiConnection.get('data', transformFunc);
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
}