import ApiConnection from './ApiConnection';
import { DataSetDataQuery, ViewDetailQuery } from './Types';
import { formatDate } from './Util';

export default class ViewClient {
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
     * Get the data for a view
     * 
     * @param {string} viewName - the name of the view to retrieve
     * @param {number} page - page of results to retrieve, defaults to first page = 0
     * @param {number} pageSize - how many results per page, defaults to 50
     * @return {Promise<object,any>} The view data
     * @see http://docs.nexosis.com/guides/views
     */
    get(viewName: string, query?: DataSetDataQuery, page = 0, pageSize = 50) {
        var parameters = {
            page: page,
            pageSize: pageSize,
        };
        if (query) {
            if (query.startDate) {
                Object.defineProperty(parameters, 'startDate', {
                    value: formatDate(query.startDate),
                    enumerable: true
                });
            }
            if (query.endDate) {
                Object.defineProperty(parameters, 'endDate', {
                    value: formatDate(query.endDate),
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

        return this._apiConnection.get(`views/${viewName}`, this.FetchTransformFunction, parameters);
    }

    /**
     * Create a new view
     * 
     * @param {string} viewName - Name of the view to create
     * @param {object} view - A json object containing the view definition. Conforms to view definition schema. {"dataSetName" : "myDataSet", "columns": {"col1" : {"dataType" : "numeric", "role" : "target"}}, "joins": [{"dataSet" : {"name" : "myDataSet2"}}]}
     * @see http://docs.nexosis.com/guides/views
     */
    create(viewName: string, view: object) {
        return this._apiConnection.put(`views/${viewName}`, view, this.FetchTransformFunction);
    }

    /**
     * List all views, with optional filters
     * 
     * @param {object} query - Optional query object, limiting the results to the matching views.
     * @param {number} page - page of results to retrieve, defaults to first page = 0
     * @param {number} pageSize - how many results per page, defaults to 50
     */
    list(query?: ViewDetailQuery, page = 0, pageSize = 50) {
        var parameters = {
            page: page,
            pageSize: pageSize
        };

        if (query) {
            if (query.viewPartialName && query.viewPartialName.length > 0) {
                Object.defineProperty(parameters, 'partialName', {
                    value: query.viewPartialName,
                    enumerable: true
                });
            }

            if (query.dataSetName && query.dataSetName.length > 0) {
                Object.defineProperty(parameters, 'dataSetName', {
                    value: query.dataSetName,
                    enumerable: true
                });
            }
        }
        return this._apiConnection.get('views', this.FetchTransformFunction, parameters);
    }

    /**
     * Removes a view
     * 
     * @param {string} viewName - Name of the dataset from which to remove data
     * @param {string} options - Delete options. If provided, should be object literal conforming to following schema: {"cascade" : "session"}
     */
    remove(viewName: string, options?: string) {
        var parameters = {};

        if (options) {
            Object.defineProperty(parameters, 'options', {
                value: options,
                enumerable: true
            });
        }
        return this._apiConnection.delete(`views/${viewName}`, this.FetchTransformFunction, parameters);
    }

}