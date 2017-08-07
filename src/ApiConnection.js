import ApiConnectionOptions from './ApiConnectionOptions';
import URLSearchParams from "url-search-params";

export default class ApiConnection {
    constructor({ endpoint, key }) {
        this._endpoint = endpoint || ApiConnectionOptions.BASE_URL;
        this._key = key;
    }

    buildRequest(httpMethod, path, parameters = {}, payload = {}) {
        var reqHeaders = new Headers();
        reqHeaders.append('Content-Type', 'application/json');
        reqHeaders.append('Access-Control-Allow-Origin', '*');
        reqHeaders.append('api-key', this._key);
        reqHeaders.append('User-Agent', ApiConnectionOptions.CLIENT_VERSION);

        var queryString = '';
        if (Object.keys(parameters).length > 0) {
            var urlParams = new URLSearchParams();
            Object.keys(parameters).forEach((p) => urlParams.append(p, parameters[p]));
            queryString = `?${urlParams.toString()}`;
        }

        var options = {
            method: httpMethod,
            headers: reqHeaders,
            mode: 'cors'
        };

        if (Object.keys(payload).length > 0) {
            Object.defineProperty(options, 'body', {
                value: JSON.stringify(payload)
            });
        }


        return new Request(`${this._endpoint}/${path}${queryString}`, options);
    }

    getHeaders(path, transformFunction, parameters = {}) {
        let req = this.buildRequest('GET', path, parameters);
        return fetch(req).then((httpResp) => {
            return httpResp.headers;
        });
    }

    get(path, transformFunction, parameters = {}) {
        return new Promise((resolve, reject) => {
            let req = this.buildRequest('GET', path, parameters);
            let returnFunc = resolve;
            fetch(req).then((httpResp) => {
                returnFunc = ApiConnection.handleErrors(httpResp, resolve, reject);
                return httpResp.json();
            }).then((data) => {
                if (undefined === transformFunction)
                    return returnFunc(data);
                return returnFunc(transformFunction(data));
            }).catch((err) => reject(err));
        });
    }

    head(path, transformFunction, parameters = {}) {
        return new Promise((resolve, reject) => {
            let req = this.buildRequest('HEAD', path, parameters);
            let returnFunc = resolve;
            fetch(req).then((httpResp) => {
                returnFunc = ApiConnection.handleErrors(httpResp, resolve, reject);
                if (undefined === transformFunction)
                    return returnFunc(httpResp.headers);
                return returnFunc(transformFunction(httpResp.headers));
            }).catch((err) => reject(err));
        });
    }

    post(path, payload, transformFunction, parameters = {}) {
        return new Promise((resolve, reject) => {
            let req = this.buildRequest('POST', path, parameters, payload);
            let returnFunc = resolve;
            fetch(req).then((httpResp) => {
                returnFunc = ApiConnection.handleErrors(httpResp, resolve, reject);
                return httpResp.json();
            }).then((data) => {
                if (undefined === transformFunction)
                    return returnFunc(data);
                return returnFunc(transformFunction(data));
            }).catch((err) => reject(err));
        });
    }

    put(path, payload, transformFunction, parameters = {}) {
        return new Promise((resolve, reject) => {
            let req = this.buildRequest('PUT', path, parameters, payload);
            let returnFunc = resolve;
            fetch(req).then((httpResp) => {
                returnFunc = ApiConnection.handleErrors(httpResp, resolve, reject);
                return httpResp.json();
            }).then((data) => {
                if (undefined === transformFunction)
                    return returnFunc(data);
                return returnFunc(transformFunction(data));
            }).catch((err) => reject(err));
        });
    }

    delete(path, transformFunction, parameters = {}) {
        return new Promise((resolve, reject) => {
            let req = this.buildRequest('DELETE', path);
            let returnFunc = resolve;
            fetch(req).then((httpResp) => {
                returnFunc = ApiConnection.handleErrors(httpResp, resolve, reject);
                if (transformFunction === null || undefined === transformFunction)
                    return returnFunc(httpResp);
                return returnFunc(transformFunction(httpResp));
            }).catch((err) => reject(err));
        });
    }

    static handleErrors(response, resolve, reject) {
        if (!response.ok) {
            return reject;
        }
        return resolve;
    }
}