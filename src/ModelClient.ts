import ApiClientBase from './ApiClientBase';
import { ModelSummaryQuery, PredictionExtraParameters } from './Types';
import { formatDate } from './Util';

export default class ModelClient extends ApiClientBase {

    /**
     * Get details of a model by modelId
     *
     * @param {string} id - A model id returned from a model session.
     */
    get(id: string) {
        return this._apiConnection.get(`models/${id}`, this.FetchTransformFunction);
    }

    /**
     * List all models, optionally limited by search params.  Will return all models otherwise.
     * 
     * @param {object} query - Optional query object, limiting the results to the matching models.
     * @param {number} page - Zero-based page number of models to retrieve.
     * @param {number} pageSize - Count of models to retrieve in each page (max 1000).
     */
    list(query?: ModelSummaryQuery, page = 0, pageSize = 50) {
        var parameters = {
            page: page,
            pageSize: pageSize
        };

        if (query) {
            if (query.dataSourceName) {
                Object.defineProperty(parameters, 'dataSourceName', {
                    value: query.dataSourceName,
                    enumerable: true
                });
            }

            if (query.createdAfterDate) {
                Object.defineProperty(parameters, 'createdAfterDate', {
                    value: formatDate(query.createdAfterDate),
                    enumerable: true
                });
            }

            if (query.createdBeforeDate) {
                Object.defineProperty(parameters, 'createdBeforeDate', {
                    value: formatDate(query.createdBeforeDate),
                    enumerable: true
                });
            }
        }
        return this._apiConnection.get('models', this.FetchTransformFunction, parameters);
    }


    /**
     * Predicts target values for a set of features using a model.
     * 
     * @param {string} id - Model identifier to use for this prediction.
     * @param {array} data - Array of objects to predict values for.
     * @param {object} extraParameters - Object of extra parameters to alter the results from predicting.
     */
    predict(id: string, data: Array<object>, extraParameters?: PredictionExtraParameters) {
        var body = {
            data: data,
            extraParameters: extraParameters
        };
        return this._apiConnection.post(`models/${id}/predict`, body, this.FetchTransformFunction);
    }


    /**
     * Remove a model from your account
     * 
     * @param {string} id - Identifier of the model to remove
     */
    remove(id: string) {
        return this._apiConnection.delete(`models/${id}`, this.FetchTransformFunction);
    }
}