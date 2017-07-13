import ApiConnectionOptions from './ApiConnectionOptions';

export default class ApiConnection {
    constructor({ endpoint, key }) {
        this._endpoint = endpoint;
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

    get(path, transformFunction, parameters = {}) {
        return new Promise((resolve, reject) => {
            let req = this.buildRequest('GET', path, parameters);
            fetch(req).then((httpResp) => {
                ApiConnection.handleErrors(httpResp);
                return httpResp.json();
            }).then((data) => {
                if (undefined === transformFunction)
                    return resolve(data);
                return resolve(transformFunction(data));
            }).catch((err) => reject(err));
        });
    }

    head(path, transformFunction, parameters = {}) {
        return new Promise((resolve, reject) => {
            let req = this.buildRequest('HEAD', path, parameters);
            fetch(req).then((httpResp) => {
                ApiConnection.handleErrors(httpResp);
                if (undefined === transformFunction)
                    return resolve(httpResp.headers);
                return resolve(transformFunction(httpResp.headers));
            }).catch((err) => reject(err));
        });
    }

    post(path, payload, transformFunction, parameters = {}) {
        return new Promise((resolve, reject) => {
            let req = this.buildRequest('POST', path, parameters, payload);
            fetch(req).then((httpResp) => {
                ApiConnection.handleErrors(httpResp);
                return httpResp.json();
            }).then((data) => {
                if (undefined === transformFunction)
                    return resolve(data);
                return resolve(transformFunction(data));
            }).catch((err) => reject(err));
        });
    }

    put(path, payload, transformFunction, parameters = {}) {
        return new Promise((resolve, reject) => {
            let req = this.buildRequest('PUT', path, parameters, payload);
            fetch(req).then((httpResp) => {
                ApiConnection.handleErrors(httpResp);
                return httpResp.json();
            }).then((data) => {
                if (undefined === transformFunction)
                    return resolve(data);
                return resolve(transformFunction(data));
            }).catch((err) => reject(err));
        });
    }

    delete(path, transformFunc, parameters = {}) {
        return new Promise((resolve, reject) => {
            let req = this.buildRequest('DELETE', path);
            fetch(req).then((httpResp) => {
                ApiConnection.handleErrors(httpResp);
                if (undefined === transformFunction)
                    return resolve(httpResp);
                return resolve(transformFunction(httpResp));
            }).catch((err) => reject(err));
        });
    }

    static handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }
}