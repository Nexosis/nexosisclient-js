import ApiConnection from './ApiConnection';

export default class ApiClientBase {
    protected _apiConnection;

    /** Function to modify the request and response objects for the fetch call. */
    FetchTransformFunction;

    constructor(apiConnection) {
        if (apiConnection instanceof ApiConnection) {
            this._apiConnection = apiConnection;
        }
        else {
            this._apiConnection = new ApiConnection(apiConnection);
        }
    }

}