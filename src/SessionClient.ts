import ApiClientBase from './ApiClientBase';

/**
 * Class for interacting with Session specific features of the Nexosis API.
 */
export default class SessionClient extends ApiClientBase {
    /**
     * Start a new impact session on a named dataset with the given parameters
     * 
     * @param {string} dataSetName - Name of existing dataset to use for this session
     * @param {Date} startDate - The start of the event time frame to analyze.
     * @param {Date} endDate - The end of the event frame to analyze.
     * @param {string} eventName - The name of the event.
     * @param {string} targetColumn - The name of the column on which to analyze impact. Can be null if defined in columnMetadata.
     * @param {string} resultInterval - A constant value indicating periodicity of results: hour, day (default), week, month, year.
     * @param {function} transformFunc - function to transform results data from the request
     * @param {string} statusCallbackUrl - a url which will be requested when status changes
     * @param {object} columnMetadata - a json object consistent with metadata schema ({"columns": {"mycolumnname":{"dataType": "date", "role" : "timestamp"}}})
     * @return {Promise<object,any>} The session result object with details on what was submitted
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/59149d7da730020f20dd41aa
     */
    analyzeImpact(dataSetName, startDate, endDate, eventName, targetColumn = null, resultInterval = 'day', transformFunc = undefined, statusCallbackUrl = '', columnMetadata = {}) {
        var parameters = prepareParameters.call(this, startDate, endDate, dataSetName, targetColumn, eventName, resultInterval, statusCallbackUrl);
        return this._apiConnection.post('sessions/impact', columnMetadata, transformFunc, parameters);
    }

    /**
     * Start a new forecast session on a named dataset with the given parameters
     * 
     * @param {object} dataSetName - Name of existing dataset to use for this session
     * @param {Date} startDate - The start of the event time frame to analyze.
     * @param {Date} endDate - The end of the event frame to analyze.
     * @param {string} targetColumn - The name of the column on which to analyze impact. Can be null if defined in columnMetadata.
     * @param {string} resultInterval - A constant value indicating periodicity of results: hour, day (default), week, month, year.
     * @param {function} transformFunc - function to transform results data from the request
     * @param {string} statusCallbackUrl - a url which will be requested when status changes
     * @param {object} columnMetadata - a json object consistent with metadata schema ({"columns": {"mycolumnname":{"dataType": "date", "role" : "timestamp"}}})
     * @return {Promise<object,any>} The session result object with details on what was submitted
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/59149d7da730020f20dd41ab
     */
    createForecast(dataSetName, startDate, endDate, targetColumn, resultInterval, statusCallbackUrl, transformFunc, columnMetadata = {}) {
        var parameters = prepareParameters.call(this, startDate, endDate, dataSetName, targetColumn, '', resultInterval, statusCallbackUrl);
        return this._apiConnection.post('sessions/forecast', columnMetadata, transformFunc, parameters);
    }

    /**
     * Start a new model model-building session.
     * 
     * @param {string} dataSourceName - Name of existing datasource to use for this session.
     * @param {string} targetColumn  - Column in the specified data source to predict with the generated model
     * @param {string} predictionDomain - Type of prediction the built model is intended to make.
     * @param {string} statusCallbackUrl - A url which will be requested when status changes.
     * @param {function} transformFunc - Function to transform results data from the request.
     * @param {object} columnMetadata - A json object consistent with metadata schema  ({"columns": {"mycolumnname":{"dataType": "date", "role" : "timestamp"}}})
     */
    trainModel(dataSourceName, targetColumn, predictionDomain, statusCallbackUrl, transformFunc, columnMetadata = {}) {
        var body = prepareModelBody(dataSourceName, targetColumn, predictionDomain, statusCallbackUrl, columnMetadata)
        return this._apiConnection.post('sessions/model', body, transformFunc);
    }

    /**
     * Get details of a session by sessionId
     * 
     * @param {string} id - a session id returned from a previous request to start a session. 
     * @param {function} transformFunc - function to transform results data from the request
     * @return {Promise<object,any>} The session result object with details on what was submitted
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/59149d7da730020f20dd41a8
     */
    get(id, transformFunc) {
        return this._apiConnection.get(`sessions/${id}`, transformFunc);
    }

    /**
     * Get status header only of a session by sessionId
     * 
     * @param {string} id - a session id returned from a previous request to start a session. 
     * @param {function} transformFunc - function to transform results data from the request
     * @return {Promise<object,any>} The session header with status
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/59149d7da730020f20dd41a9
     */
    status(id, transformFunc = undefined) {
        return this._apiConnection.head(`sessions/${id}`, transformFunc).then(headers => {
            return headers.get('nexosis-session-status', transformFunc);
        });
    }

    /**
     * Remove a session and its results from your account
     * 
     * @param {string} id - a session id returned from a previous request to start a session. 
     * @param {function} transformFunc - function to transform results data from the request
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/593949c4e0ef6e0cb481aa31
     */
    remove(id, transformFunc) {
        return this._apiConnection.delete(`sessions/${id}`, transformFunc);
    }

    /**
     * Get the results of a session
     * 
     * @param {string} id - a session id returned from a previous request to start a session. 
     * @param {function} transformFunc - function to transform results data from the request
     * @return {Promise<object,any>} The session with all result rows
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/59149d7da730020f20dd41a7
     */
    results(id, transformFunc) {
        return this._apiConnection.get(`sessions/${id}/results`, transformFunc);
    }

    /**
     * Get the specific interval results of a session
     * 
     * @param {string} id - a session id returned from a previous request to start a session. 
     * @param {string} predictionInterval - a specific interval from the session's availablePredictionIntervals
     * @param {function} transformFunc - function to transform results data from the request
     * @return {Promise<object,any>} The session with all result rows
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/59149d7da730020f20dd41a7
     */
    resultsByInterval(id, predictionInterval, transformFunc) {
        return this._apiConnection.get(`sessions/${id}/results`, transformFunc, { "predictionInterval": predictionInterval });
    }

    /**
     * 
     * @param {string} id - completed classification model building id
     * @return {Promise<object,any} The results with 'confusionMatrix' and 'classes' properties 
     */
    confusionMatrixResults(id, transformFunc) {
        return this._apiConnection.get(`sessions/${id}/results/confusionmatrix`, transformFunc);
    }

    /**
     * List all sessions, optionally limited by search params. Will return all sessions otherwise.
     * 
     * @param {string} dataSetName - return only sessions run on this dataset
     * @param {string} eventName - return impact sessions only run on this event
     * @param {*} requestedAfterDate - return sessions requested after this date
     * @param {*} requestedBeforeDate - return sessions requested before this date
     * @param {*} transformFunc - function to transform results data from the request
     * @return {Promise<object,any>} The session result object with details on what was submitted
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/59149d7da730020f20dd41a6
     */
    list(dataSetName, eventName, requestedAfterDate, requestedBeforeDate, page = 0, pageSize = 50, transformFunc = undefined) {
        var parameters = {
            page: page,
            pageSize: pageSize
        };
        if (dataSetName) {
            Object.defineProperty(parameters, 'dataSetName', {
                value: dataSetName,
                enumerable: true
            });
        }

        if (eventName) {
            Object.defineProperty(parameters, 'eventName', {
                value: eventName,
                enumerable: true
            });
        }

        if (requestedAfterDate) {
            Object.defineProperty(parameters, 'requestedAfterDate', {
                value: requestedAfterDate,
                enumerable: true
            });
        }

        if (requestedBeforeDate) {
            Object.defineProperty(parameters, 'requestedBeforeDate', {
                value: requestedBeforeDate,
                enumerable: true
            });
        }

        return this._apiConnection.get('sessions', transformFunc, parameters);
    }
}

const prepareParameters = function (startDate, endDate, datasetName = '', targetColumn = '', eventName = '', resultInterval = 'day', statusCallbackUrl = '') {
    var parameters = {
        startDate: startDate,
        endDate: endDate,
        resultInterval: resultInterval
    };

    if (datasetName.length > 0) {
        Object.defineProperty(parameters, 'dataSourceName', {
            value: datasetName,
            enumerable: true
        });
    }

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

const prepareModelBody = function (dataSourceName, targetColumn, predictionDomain, statusCallbackUrl = '', columnMetadata = {}) {
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

    return body;
}