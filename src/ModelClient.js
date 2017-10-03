import ApiClientBase from './ApiClientBase';

export default class ModelClient extends ApiClientBase {

    /**
     * Get details of a model by modelId
     *
     * @param {string} id - A model id returned from a model session.
     * @param {function} transformFunc - Function to transform results data from the request.
     */
    get(id, transformFunc) {
        return this._apiConnection.get(`models/${id}`, transformFunc);
    }

    /**
     * List all models, optionally limited by search params.  Will return all models otherwise.
     * 
     * @param {string} dataSouceName - Return only models trained for this datasource.
     * @param {Date} createdAfterDate - Limits models to those created on or after the specified date.
     * @param {Date} createdBeforeDate - Limits models to those created on or before the specified date.
     * @param {page} page - Zero-based page number of models to retrieve.
     * @param {pageSize} pageSize - Count of models to retrieve in each page (max 1000).
     * @param {function} transformFunc - Function to transform results data from the request.
     */
    list(dataSouceName, createdAfterDate, createdBeforeDate, page = 0, pageSize = 30, transformFunc = undefined) {
        var parameters = {
            page: 0,
            pageSize: 10
        };

        if (dataSouceName) {
            Object.defineProperty(parameters, 'dataSourceName', {
                value: dataSouceName,
                enumerable: true
            });
        }

        return this._apiConnection.get('models', transformFunc, parameters);
    }


    /**
     * Predicts target values for a set of features using a model.
     * 
     * @param {string} id - Model identifier to use for this prediction.
     * @param {array} data - Array of objects to predict values for.
     * @param {function} transformFunc - Function to transform results data from the request.
     */
    predict(id, data, transformFunc) {
        var body = {
            data: data
        };
        return this._apiConnection.post(`models/${id}/predict`, body, transformFunc);
    }


    /**
     * Remove a model from your account
     * 
     * @param {string} id - Identifier of the model to remove
     * @param {function} transformFunc - Function to transform results data from the request.
     */
    remove(id, transformFunc) {
        return this._apiConnection.delete(`models/${id}`, transformFunc);
    }
}