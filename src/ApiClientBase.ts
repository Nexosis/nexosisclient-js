import ApiConnection from './ApiConnection';

export default class ApiClientBase {
    protected _apiConnection;

    constructor(apiConnection) {
        if (apiConnection instanceof ApiConnection) {
            this._apiConnection = apiConnection;
        }
        else {
            this._apiConnection = new ApiConnection(apiConnection);
        }
    }
}