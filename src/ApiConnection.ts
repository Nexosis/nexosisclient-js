import ApiConnectionOptions from './ApiConnectionOptions';
import URLSearchParams from "url-search-params";

export default class ApiConnection {
    private _endpoint;
    private _key;

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

        const mode: RequestMode = 'cors';

        var options = {
            method: httpMethod,
            headers: reqHeaders,
            mode: mode
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
        req = this.modifyRequest(req, transformFunction);
        return fetch(req).then((httpResp) => {
            this.modifyResponse(req, httpResp, transformFunction);
            return httpResp.headers;
        });
    }

    get(path, transformFunction, parameters = {}) {
        return new Promise((resolve, reject) => {
            let req = this.buildRequest('GET', path, parameters);
            req = this.modifyRequest(req, transformFunction);
            let returnFunc = resolve;
            fetch(req).then(httpResp => {
                this.modifyResponse(req, httpResp, transformFunction);
                returnFunc = ApiConnection.handleErrors(httpResp, resolve, reject);
                return httpResp.json();
            }).then((data) => {
                return returnFunc(data);
            }).catch((err) => reject(err));
        });
    }

    head(path, transformFunction, parameters = {}) {
        return new Promise((resolve, reject) => {
            let req = this.buildRequest('HEAD', path, parameters);
            req = this.modifyRequest(req, transformFunction);
            let returnFunc = resolve;
            fetch(req).then(httpResp => {
                this.modifyResponse(req, httpResp, transformFunction);
                returnFunc = ApiConnection.handleErrors(httpResp, resolve, reject);
                return returnFunc(httpResp.headers)
            }).catch((err) => reject(err));
        });
    }

    post(path, payload, transformFunction, parameters = {}) {
        return new Promise((resolve, reject) => {
            let req = this.buildRequest('POST', path, parameters, payload);
            this.modifyRequest(req, transformFunction);
            let returnFunc = resolve;
            fetch(req).then(httpResp => {
                this.modifyResponse(req, httpResp, transformFunction);
                returnFunc = ApiConnection.handleErrors(httpResp, resolve, reject);
                return httpResp.json();
            }).then((data) => {
                return returnFunc(data);
            }).catch((err) => reject(err));
        });
    }

    put(path, payload, transformFunction, parameters = {}) {
        return new Promise((resolve, reject) => {
            let req = this.buildRequest('PUT', path, parameters, payload);
            req = this.modifyRequest(req, transformFunction);
            let returnFunc = resolve;
            fetch(req).then(httpResp => {
                this.modifyResponse(req, httpResp, transformFunction);
                returnFunc = ApiConnection.handleErrors(httpResp, resolve, reject);
                return httpResp.json();
            }).then((data) => {
                return returnFunc(data);
            }).catch((err) => reject(err));
        });
    }

    delete(path, transformFunction, parameters = {}) {
        return new Promise((resolve, reject) => {
            let req = this.buildRequest('DELETE', path, parameters);
            req = this.modifyRequest(req, transformFunction);
            let returnFunc = resolve;
            fetch(req).then(httpResp => {
                this.modifyResponse(req, httpResp, transformFunction);
                returnFunc = ApiConnection.handleErrors(httpResp, resolve, reject);
                return returnFunc(httpResp)
            }).catch((err) => reject(err));
        });
    }

    modifyRequest(request, transformFunction) {
        if (transformFunction) {
            return transformFunction(request.clone());
        }
        return request;
    }

    modifyResponse(request, response, transformFunction) {
        if (transformFunction) {
            transformFunction(request.clone(), response.clone());
        }
    }

    static handleErrors(response, resolve, reject) {
        if (!response.ok) {
            return reject;
        }
        return resolve;
    }
}