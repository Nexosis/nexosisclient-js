import ApiConnection from './ApiConnection';

export default class ViewClient {
    private _apiConnection: ApiConnection;

    constructor(apiConnection) {
        if (apiConnection instanceof ApiConnection) {
            this._apiConnection = apiConnection;
        } else {
            this._apiConnection = new ApiConnection(apiConnection);
        }
    }

    /**
     * Get the data for a view
     * 
     * @param {string} viewName - the name of the view to retrieve
     * @param {Date} startDate - optional starting date to begin retrieving data. inclusive. 
     * @param {Date} endDate - optional ending date to begin retrieving data. inclusive.
     * @param {integer} page - page of results to retrieve, defaults to first page = 0
     * @param {integer} pageSize - how many results per page, defaults to 50
     * @param {Array} include - optional string array of column names to include in result. Leave empty to return all columns.
     * @param {function} transformFunc - function to transform results data from the request
     * @return {Promise<object,any>} The view data
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/59a096c3e0ef6e0dec8a4f10
     * @see http://docs.nexosis.com/guides/views
     */
    get(viewName, startDate = null, endDate = null, page = 0, pageSize = 50, include = [], transformFunc = undefined) {
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

        return this._apiConnection.get(`views/${viewName}`, transformFunc, parameters);
    }

    /**
     * Create a new view
     * 
     * @param {string} viewName - Name of the view to create
     * @param {object} view - A json object containing the view definition. Conforms to view definition schema. {"dataSetName" : "myDataSet", "columns": {"col1" : {"dataType" : "numeric", "role" : "target"}}, "joins": [{"dataSet" : {"name" : "myDataSet2"}}]}
     * @param {function} transformFunc - function to transform results data from the request
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/59a096c3e0ef6e0dec8a4f11
     * @see http://docs.nexosis.com/guides/views
     */
    create(viewName, view, transformFunc) {
        return this._apiConnection.put(`views/${viewName}`, view, transformFunc);
    }

    /**
     * List all views, with optional filters
     * 
     * @param {string} viewPartialName - optional search parameter on partial view name
     * @param {string} dataSetName - optional search parameter on the name of a dataSet that the view uses
     * @param {integer} page - page of results to retrieve, defaults to first page = 0
     * @param {integer} pageSize - how many results per page, defaults to 50
     * @param {function} transformFunc - function to transform results data from the request
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/59a096c2e0ef6e0dec8a4f0f
     */
    list(viewPartialName = '', dataSetName = '', page = 0, pageSize = 50, transformFunc = undefined) {
        var parameters = {
            page: page,
            pageSize: pageSize
        };
        if (viewPartialName.length > 0) {
            Object.defineProperty(parameters, 'partialName', {
                value: viewPartialName,
                enumerable: true
            });
        }

        if (dataSetName.length > 0) {
            Object.defineProperty(parameters, 'dataSetName', {
                value: dataSetName,
                enumerable: true
            });
        }
        return this._apiConnection.get('views', transformFunc, parameters);
    }

    /**
     * Removes a view
     * 
     * @param {string} viewName - Name of the dataset from which to remove data
     * @param {string} options - Delete options. If provided, should be object literal conforming to following schema: {"cascade" : "session"}
     * @param {function} transformFunc - function to transform results data from the request
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/59a096c3e0ef6e0dec8a4f12
     */
    remove(viewName, options, transformFunc) {
        var parameters = {};

        if (options) {
            Object.defineProperty(parameters, 'options', {
                value: options,
                enumerable: true
            });
        }
        return this._apiConnection.delete(`views/${viewName}`, transformFunc, parameters);
    }

}