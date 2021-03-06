import ApiClientBase from './ApiClientBase';
import { SessionListQuery, ResultInterval, PredictionDomain, AnalyzeImpactOptions, ForecastOptions, ModelSessionOptions, SessionExtraParameters } from './Types';
import { formatDate, addListQueryParameters } from './Util';

/**
 * Class for interacting with Session specific features of the Nexosis API.
 */
export default class SessionClient extends ApiClientBase {
    /**
     * Start a new impact session on a named dataset with the given parameters
     * 
     * @param {string | AnalyzeImpactOptions} dataSourceNameOrOptions - Options used to start the impact session, or, the name of existing dataSource to use for this session
     * @param {Date} startDate - The start of the event time frame to analyze.
     * @param {Date} endDate - The end of the event frame to analyze.
     * @param {string} eventName - The name of the event.
     * @param {string} targetColumn - The name of the column on which to analyze impact. Can be null if defined in columnMetadata.
     * @param {string} resultInterval - A constant value indicating periodicity of results: hour, day (default), week, month, year.
     * @param {function} transformFunc - function to transform results data from the request
     * @param {object} columnMetadata - a json object consistent with metadata schema ({"columns": {"mycolumnname":{"dataType": "date", "role" : "timestamp"}}})
     * @param {string} statusCallbackUrl - a url which will be requested when status changes
     * @return {Promise<object,any>} The session result object with details on what was submitted
     */
    analyzeImpact(options: AnalyzeImpactOptions);
    analyzeImpact(dataSourceName: string, startDate: Date | string, endDate: Date | string, eventName: string, targetColumn?: string, resultInterval?: ResultInterval, columnMetadata?: object, statusCallbackUrl?: string);
    analyzeImpact(nameOrOptions: string | AnalyzeImpactOptions, startDate?: Date | string, endDate?: Date | string, eventName?: string, targetColumn?: string, resultInterval?: ResultInterval, columnMetadata?: object, statusCallbackUrl?: string) {
        let parameters;
        let metadata;
        if (typeof nameOrOptions === 'object') {
            parameters = prepareParameters.call(this, nameOrOptions.startDate, nameOrOptions.endDate, nameOrOptions.dataSourceName, nameOrOptions.targetColumn, nameOrOptions.eventName, nameOrOptions.resultInterval, nameOrOptions.statusCallbackUrl);
            metadata = nameOrOptions.columnMetadata;
        } else {
            parameters = prepareParameters.call(this, startDate, endDate, nameOrOptions, targetColumn, eventName, resultInterval, statusCallbackUrl);
            metadata = columnMetadata;
        }

        const requestBody = Object.assign({}, parameters, metadata);
        return this._apiConnection.post('sessions/impact', requestBody, this.FetchTransformFunction);
    }

    /**
     * Start a new forecast session on a named dataset with the given parameters
     * 
     * @param {string | object } dataSourceNameOrOptions - Options used to start the forecast session, or, the name of existing dataSource to use for this session
     * @param {Date} startDate - The start of the event time frame to analyze.
     * @param {Date} endDate - The end of the event frame to analyze.
     * @param {string} targetColumn - The name of the column on which to forecast. Can be null if defined in columnMetadata.
     * @param {string} resultInterval - A constant value indicating periodicity of results: hour, day (default), week, month, year.
     * @param {object} columnMetadata - a json object consistent with metadata schema ({"columns": {"mycolumnname":{"dataType": "date", "role" : "timestamp"}}})
     * @param {string} statusCallbackUrl - a url which will be requested when status changes
     * @return {Promise<object,any>} The session result object with details on what was submitted
     */
    createForecast(options: ForecastOptions);
    createForecast(dataSourceName: string, startDate: Date | string, endDate: Date | string, targetColumn?: string, resultInterval?: ResultInterval, columnMetadata?: object, statusCallbackUrl?: string);
    createForecast(nameOrOptions: string | ForecastOptions, startDate?: Date | string, endDate?: Date | string, targetColumn?: string, resultInterval?: ResultInterval, columnMetadata?: object, statusCallbackUrl?: string) {
        let parameters;
        let metadata;
        if (typeof nameOrOptions === 'object') {
            parameters = prepareParameters.call(this, nameOrOptions.startDate, nameOrOptions.endDate, nameOrOptions.dataSourceName, nameOrOptions.targetColumn, '', nameOrOptions.resultInterval, nameOrOptions.statusCallbackUrl);
            metadata = nameOrOptions.columnMetadata;
        } else {
            parameters = prepareParameters.call(this, startDate, endDate, nameOrOptions, targetColumn, '', resultInterval, statusCallbackUrl);
            metadata = columnMetadata;
        }
        const requestBody = Object.assign({}, parameters, metadata);
        return this._apiConnection.post('sessions/forecast', requestBody, this.FetchTransformFunction);
    }

    /**
     * Start a new model model-building session.
     * 
     * @param {string} dataSourceName - Name of existing dataSource to use for this session.
     * @param {string} predictionDomain - Type of prediction the built model is intended to make.
     * @param {string} targetColumn  - Column in the specified data source to predict with the generated model
     * @param {object} columnMetadata - A json object consistent with metadata schema  ({"columns": {"mycolumnname":{"dataType": "date", "role" : "timestamp"}}})
     * @param {string} statusCallbackUrl - A url which will be requested when status changes.
     * @return {Promise<object,any>} The session result object with details on what was submitted
     */
    trainModel(options: ModelSessionOptions);
    trainModel(dataSourceName: string, predictionDomain: PredictionDomain, targetColumn?: string, columnMetadata?: object, statusCallbackUrl?: string, extraParameters?: SessionExtraParameters);
    trainModel(nameOrOptions: string | ModelSessionOptions, predictionDomain?: PredictionDomain, targetColumn?: string, columnMetadata = {}, statusCallbackUrl?: string, extraParameters?: SessionExtraParameters) {
        let body;
        if (typeof nameOrOptions === 'object') {
            body = prepareModelBody(nameOrOptions.dataSourceName, nameOrOptions.targetColumn, nameOrOptions.predictionDomain, nameOrOptions.statusCallbackUrl, nameOrOptions.columnMetadata, nameOrOptions.extraParameters);
        } else {
            body = prepareModelBody(nameOrOptions, targetColumn, predictionDomain, statusCallbackUrl, columnMetadata, extraParameters)
        }

        return this._apiConnection.post('sessions/model', body, this.FetchTransformFunction);
    }

    /**
     * Get details of a session by sessionId
     * 
     * @param {string} id - a session id returned from a previous request to start a session. 
     * @return {Promise<object,any>} The session result object with details of the session
     */
    get(id: string) {
        return this._apiConnection.get(`sessions/${id}`, this.FetchTransformFunction);
    }

    /**
     * Get status header only of a session by sessionId
     * 
     * @param {string} id - a session id returned from a previous request to start a session. 
     * @return {Promise<object,any>} The session header with the current status of the session.
     */
    status(id: string) {
        return this._apiConnection.head(`sessions/${id}`, this.FetchTransformFunction).then(headers => {
            return headers.get('nexosis-session-status');
        });
    }

    /**
     * Remove a session and its results from your account
     * 
     * @param {string} id - a session id returned from a previous request to start a session. 
     */
    remove(id: string) {
        return this._apiConnection.delete(`sessions/${id}`, this.FetchTransformFunction);
    }

    /**
     * Get the results of a session
     * 
     * @param {string} id - a session id returned from a previous request to start a session. 
     * @return {Promise<object,any>} The session with all result data.
     */
    results(id: string) {
        return this._apiConnection.get(`sessions/${id}/results`, this.FetchTransformFunction);
    }

    /**
     * Get the specific interval results of a session
     * 
     * @param {string} id - a session id returned from a previous request to start a session. 
     * @param {string} predictionInterval - a specific interval from the session's availablePredictionIntervals
     * @return {Promise<object,any>} The session with all result data using the given interval.
     */
    resultsByInterval(id: string, predictionInterval: number) {
        return this._apiConnection.get(`sessions/${id}/results`, this.FetchTransformFunction, { "predictionInterval": predictionInterval });
    }



    /**
     * 
     * @param {string} id - completed classification model building id
     * @return {Promise<object,any} The results with 'confusionMatrix' and 'classes' properties 
     */
    confusionMatrixResults(id: string) {
        return this._apiConnection.get(`sessions/${id}/results/confusionmatrix`, this.FetchTransformFunction);
    }

    /**
     * 
     * Time series anomaly detection is used to identify anomalous target values and impute those values with smoothed values that can 
     * result in better predictions. These values are returned regardless of whether the smoothed dataset results in better predictions.
     * This is currently implemented only for time series forecasts.
     * 
     * @param {string} id - completed time series session id
     * @param {number} page - Zero-based page number of results to retrieve.
     * @param {number} pageSize - Count of results to retrieve in each page (max 1000).
     * @return {Promise<object,any>} The session result object with the outliers and input features.
     */
    timeSeriesOutliers(id: string, page = 0, pageSize = 50) {
        var parameters = {
            page: page,
            pageSize: pageSize
        };
        return this._apiConnection.get(`sessions/${id}/results/outliers`, this.FetchTransformFunction, parameters);
    }

    /**
     * 
     * Gets the scores of the entire dataset generated by a particular completed anomalies session
     * 
     * @param {string} id - completed classification model building id
     * @param {number} page - Zero-based page number of models to retrieve.
     * @param {number} pageSize - Count of models to retrieve in each page (max 1000).
     * @return {Promise<object,any>} The session result object with the anomaly scores, and input features.
     */
    anomalyScoreResults(id: string, page = 0, pageSize = 50) {
        var parameters = {
            page: page,
            pageSize: pageSize
        };
        return this._apiConnection.get(`sessions/${id}/results/anomalyscores`, this.FetchTransformFunction, parameters);
    }

    /**
     * 
     * Gets the scores of the entire dataset generated by a particular completed anomalies session
     * 
     * @param {string} id - completed classification model building id
     * @param {number} page - Zero-based page number of models to retrieve.
     * @param {number} pageSize - Count of models to retrieve in each page (max 1000).
     * @return {Promise<object,any>} The session result object with the anomaly scores, Mahalanobis distance, and input features.
     */
    anomalyDistanceMetrics(id: string, page = 0, pageSize = 50) {
        var parameters = {
            page: page,
            pageSize: pageSize
        };
        return this._apiConnection.get(`sessions/${id}/results/mahalanobisdistances`, this.FetchTransformFunction, parameters);
    }

    /**
     * 
     * Gets the class scores for each result of a particular completed classification model session
     * 
     * @param {string} id - completed classification model building id
     * @param {number} page - Zero-based page number of models to retrieve.
     * @param {number} pageSize - Count of models to retrieve in each page (max 1000).
     * @return {Promise<object,any>} The session result object with target data and the class scores related to that target.
     */
    classScoreResults(id: string, page = 0, pageSize = 50) {
        var parameters = {
            page: page,
            pageSize: pageSize
        };
        return this._apiConnection.get(`sessions/${id}/results/classscores`, this.FetchTransformFunction, parameters);
    }

    /**
     * 
     * Gets the feature importance score for each column in the data source used in a session.
     * Will only return values if the 'supportsFeatureImportance' field on the session result is 'true'.
     * 
     * @param {string} id - completed session id
     * @param {number} page - Zero-based page number of models to retrieve.
     * @param {number} pageSize - Count of models to retrieve in each page (max 1000).
     * @return {Promise<object,any>} The session result object with details on the feature importance of each feature used.
     */
    featureImportanceResults(id: string, page = 0, pageSize = 50) {
        var parameters = {
            page: page,
            pageSize: pageSize
        };
        return this._apiConnection.get(`sessions/${id}/results/featureimportance`, this.FetchTransformFunction, parameters);
    }

    /**
     * List all sessions, optionally limited by search params. Will return all sessions otherwise.
     * 
     * @param {object} query - Optional query object, limiting the results to the matching sessions.
     * @return {Promise<object,any>} The session result object with details on what was submitted
     */
    list(query?: SessionListQuery) {
        var parameters = { };
        if (query) {
            if (query.dataSourceName) {
                Object.defineProperty(parameters, 'dataSourceName', {
                    value: query.dataSourceName,
                    enumerable: true
                });
            }

            if (query.eventName) {
                Object.defineProperty(parameters, 'eventName', {
                    value: query.eventName,
                    enumerable: true
                });
            }

            if (query.requestedAfterDate) {
                Object.defineProperty(parameters, 'requestedAfterDate', {
                    value: formatDate(query.requestedAfterDate),
                    enumerable: true
                });
            }

            if (query.requestedBeforeDate) {
                Object.defineProperty(parameters, 'requestedBeforeDate', {
                    value: formatDate(query.requestedBeforeDate),
                    enumerable: true
                });
            }

            if (query.modelId) {
                Object.defineProperty(parameters, 'modelId', {
                    value: query.modelId,
                    enumerable: true
                });
            }

            addListQueryParameters(query, parameters);

        }

        return this._apiConnection.get('sessions', this.FetchTransformFunction, parameters);
    }
}


const prepareParameters = function (startDate: string | Date, endDate: string | Date, dataSourceName: string, targetColumn = '', eventName = '', resultInterval: ResultInterval = 'day', statusCallbackUrl = '') {
    var parameters = {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        resultInterval: resultInterval,
        dataSourceName: dataSourceName,
    };

    if (targetColumn.length > 0) {
        Object.defineProperty(parameters, 'targetColumn', {
            value: targetColumn,
            enumerable: true
        });
    }

    if (eventName.length > 0) {
        Object.defineProperty(parameters, 'eventName', {
            value: eventName,
            enumerable: true
        });
    }

    if (statusCallbackUrl.length > 0) {
        Object.defineProperty(parameters, 'callbackUrl', {
            value: statusCallbackUrl,
            enumerable: true
        });
    }
    return parameters;
};

const prepareModelBody = function (dataSourceName, targetColumn, predictionDomain, statusCallbackUrl = '', columnMetadata = {}, extraParameters?: SessionExtraParameters) {
    var body = {
        dataSourceName: dataSourceName,
        targetColumn: targetColumn,
        predictionDomain: predictionDomain
    };

    if (statusCallbackUrl.length > 0) {
        Object.defineProperty(body, 'callbackUrl', {
            value: statusCallbackUrl,
            enumerable: true
        });
    }

    if (columnMetadata !== undefined) {
        Object.defineProperty(body, 'columns', {
            value: columnMetadata,
            enumerable: true
        });
    }

    if (extraParameters !== undefined) {
        Object.defineProperty(body, 'extraParameters', {
            value: extraParameters,
            enumerable: true
        });
    }

    return body;
}