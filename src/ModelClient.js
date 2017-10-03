import ApiClientBase from './ApiClientBase';

export default class ModelClient extends ApiClientBase {
    get(id, transformFunc) {
        return this._apiConnection.get(`models/${id}`, transformFunc);
    }

    list(dataSouceName, transformFunc) {
        var parameters = {
            page: 0,
            pageSize: 10
        };

        if (dataSouceName) {
            Object.defineProperty(parameters, 'dataSourceName', {
                value: dataSouceName,
                enumerable: true
            });
        }

        return this._apiConnection.get('models', transformFunc, parameters);
    }

    predict(id, data, transformFunc) {
        return this._apiConnection.post(`models/${id}/predict`, data, transformFunc);
    }

    remove(id, transformFunc) {
        return this._apiConnection.delete(`models/${id}`, transformFunc);
    }
}