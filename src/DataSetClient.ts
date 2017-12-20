import ApiConnection from './ApiConnection';
import { DataSetDataQuery, DataSetData, DataSetRemoveCriteria } from './Types';

export default class DataSetClient {
    private _apiConnection: ApiConnection;

    constructor(apiConnection) {
        if (apiConnection instanceof ApiConnection) {
            this._apiConnection = apiConnection;
        } else {
            this._apiConnection = new ApiConnection(apiConnection);
        }
    }

    /** Function to modify the request and response objects for the fetch call. */
    FetchTransformFunction;

    /**
     * Get the data in a previously saved dataset
     * 
     * @param {string} dataSetName - the name of the dataset for which to retrieve data
     * @param {DataSetDataQuery} query - optional object with the filter criteria for the DataSets to retrieve.
     * @param {integer} page - page of results to retrieve, defaults to first page = 0
     * @param {integer} pageSize - how many results per page, defaults to 50
     * @return {Promise<object,any>} The dataset data results
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/5919ef80a730020dd851f232
     */
    get(dataSetName, query: DataSetDataQuery = {}, page = 0, pageSize = 50) {
        var parameters = {
            page: page,
            pageSize: pageSize,
        };

        if (query) {
            if (query.startDate) {
                Object.defineProperty(parameters, 'startDate', {
                    value: query.startDate,
                    enumerable: true
                });
            }
            if (query.endDate) {
                Object.defineProperty(parameters, 'endDate', {
                    value: query.endDate,
                    enumerable: true
                });
            }
            if (query.include && query.include.length > 0) {
                Object.defineProperty(parameters, 'include', {
                    value: query.include.join(','),
                    enumerable: true
                });
            }
        }
        return this._apiConnection.get(`data/${dataSetName}`, this.FetchTransformFunction, parameters);
    }

    /**
     * Create a new named dataset or upsert data to an existing one.
     * 
     * @param {string} dataSetName - Name of existing dataset to use for this session
     * @param {object} dataSetDetail - A json object containing the dataset. Conforms to dataset schema. {"data": [{"colum1name" : "value1", "column2name" : "value1"},{"colum1name" : "value2", "column2name" : "value2"}]}
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/5919ef80a730020dd851f233
     */
    create(dataSetName, dataSetDetail: DataSetData) {
        return this._apiConnection.put(`data/${dataSetName}`, dataSetDetail, this.FetchTransformFunction);
    }

    /**
     * List all datasets, optionally filtering by partial name
     * 
     * @param {string} dataSetPartialName - optional search parameter 
     * @param {integer} page - page of results to retrieve, defaults to first page = 0
     * @param {integer} pageSize - how many results per page, defaults to 50
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/5919ef80a730020dd851f231
     */
    list(dataSetPartialName = '', page = 0, pageSize = 50) {
        var parameters = {
            page: page,
            pageSize: pageSize
        };
        if (dataSetPartialName.length > 0) {
            Object.defineProperty(parameters, 'partialName', {
                value: dataSetPartialName,
                enumerable: true
            });
        }
        return this._apiConnection.get('data', this.FetchTransformFunction, parameters);
    }

    /**
     * Removes data from a particular dataset
     * 
     * @param {string} dataSetName - Name of the dataset from which to remove data
     * @param {DataSetRemoveCriteria} - Optional removal criteria for the given dataset.
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/5919ef80a730020dd851f235
     */
    remove(dataSetName: string, criteria?: DataSetRemoveCriteria) {
        var parameters = {};
        if (criteria) {
            if (criteria.startDate) {
                Object.defineProperty(parameters, 'startDate', {
                    value: criteria.startDate,
                    enumerable: true
                });
            }
            if (criteria.endDate) {
                Object.defineProperty(parameters, 'endDate', {
                    value: criteria.endDate,
                    enumerable: true
                });
            }
            if (criteria.cascade) {
                Object.defineProperty(parameters, 'cascade', {
                    value: criteria.cascade,
                    enumerable: true
                });
            }
        }
        return this._apiConnection.delete(`data/${dataSetName}`, this.FetchTransformFunction, parameters);
    }
}