import ApiConnection from './ApiConnection';

const DATASET_MAX_PAGE_SIZE = 10;

export default class DataSetClient {
    constructor(apiConnection, pageSize = DATASET_MAX_PAGE_SIZE) {
        if (apiConnection instanceof ApiConnection) {
            this._apiConnection = apiConnection;
        } else {
            this._apiConnection = new ApiConnection(apiConnection);
        }

        this._maxPageSize = pageSize;
    }

    /**
     * Get the data in a previously saved dataset
     * 
     * @param {string} dataSetName - the name of the dataset for which to retrieve data
     * @param {Date} startDate - optional starting date to begin retrieving data. inclusive. Can be 
     * @param {Date} endDate - optional ending date to begin retrieving data. inclusive.
     * @param {integer} page - page of results to retrieve, defaults to first page = 0
     * @param {integer} pageSize - how many results per page, defaults to 50
     * @param {Array} include - optional string array of column names to include in result. Leave empty to return all columns.
     * @param {function} transformFunc - function to transform results data from the request
     * @return {Promise<object,any>} The dataset data results
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/5919ef80a730020dd851f232
     */
    get(dataSetName, startDate = null, endDate = null, page = 0, pageSize = 50, include = [], transformFunc = undefined) {
        var parameters = {
            page: page,
            pageSize: pageSize,
        };
        if (startDate) {
            Object.defineProperty(parameters, 'startDate', {
                value: startDate,
                enumerable: true
            });
        }
        if (endDate) {
            Object.defineProperty(parameters, 'endDate', {
                value: endDate,
                enumerable: true
            });
        }
        if (include.length > 0) {
            Object.defineProperty(parameters, 'include', {
                value: include.join(','),
                enumerable: true
            });
        }

        return this._apiConnection.get(`data/${dataSetName}`, transformFunc, parameters);
    }

    /**
     * Create a new named dataset or upsert data to an existing one.
     * 
     * @param {string} dataSetName - Name of existing dataset to use for this session
     * @param {object} dataSetDetail - A json object containing the dataset. Conforms to dataset schema. {"data": [{"colum1name" : "value1", "column2name" : "value1"},{"colum1name" : "value2", "column2name" : "value2"}]}
     * @param {function} transformFunc - function to transform results data from the request
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/5919ef80a730020dd851f233
     */
    create(dataSetName, dataSetDetail, transformFunc) {
        return this._apiConnection.put(`data/${dataSetName}`, dataSetDetail, transformFunc);
    }

    /**
     * List all datasets, optionally filtering by partial name
     * 
     * @param {string} dataSetPartialName - optional search parameter 
     * @param {integer} page - page of results to retrieve, defaults to first page = 0
     * @param {integer} pageSize - how many results per page, defaults to 50
     * @param {function} transformFunc - function to transform results data from the request
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/5919ef80a730020dd851f231
     */
    list(dataSetPartialName = '', page = 0, pageSize = 50, transformFunc = undefined) {
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
        return this._apiConnection.get('data', transformFunc, parameters);
    }

    /**
     * Removes data from a particular dataset
     * 
     * @param {string} dataSetName - Name of the dataset from which to remove data
     * @param {Date} startDate -(as date-time in ISO8601). Limits data removed to those on or after the specified date
     * @param {Date} endDate - (as date-time in ISO8601). Limits data removed to those on or before the specified date
     * @param {string} cascade - Options for cascading the delete. Options are 'forecast', 'sessions', 'cascade'
     * @param {function} transformFunc - function to transform results data from the request
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/5919ef80a730020dd851f235
     */
    remove(dataSetName, startDate, endDate, cascade, transformFunc = undefined) {
        var parameters = {};

        if (startDate) {
            Object.defineProperty(parameters, 'startDate', {
                value: startDate,
                enumerable: true
            });
        }
        if (endDate) {
            Object.defineProperty(parameters, 'endDate', {
                value: endDate,
                enumerable: true
            });
        }
        if (cascade) {
            Object.defineProperty(parameters, 'cascade', {
                value: cascade,
                enumerable: true
            });
        }
        return this._apiConnection.delete(`data/${dataSetName}`, transformFunc, parameters);
    }

}