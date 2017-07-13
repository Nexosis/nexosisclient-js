import ApiConnection from './ApiConnection';

export default class ApiClientBase
{
    constructor(apiConnection){
        if(apiConnection instanceof ApiConnection){
            this._apiConnection = apiConnection;
        }
        else{
            this._apiConnection = new ApiConnection(apiConnection);
        }
    }
}