import ApiClientBase from './ApiClientBase';
import { VocabulariesQuery, VocabularyWordsQuery } from './Types';
import { formatDate } from './Util';

export default class VocabularyClient extends ApiClientBase {

    /**
     * Get details of a vocabulary by vocabulary id
     *
     * @param {string} id - A vocabulary id.
     */
    get(id: string, query?: VocabularyWordsQuery, page = 0, pageSize=50) {
        var parameters = {
            page: page,
            pageSize: pageSize
        };

        if(query) {
            if(query.type) {
                Object.defineProperty(parameters, 'type', {
                    value: query.type,
                    enumerable: true
                });
            }
        }
        return this._apiConnection.get(`vocabulary/${id}`, this.FetchTransformFunction, parameters);
    }

    /**
     * List all vocabularies, optionally limited by search params.  Will return all vocabularies otherwise.
     * 
     * @param {object} query - Optional query object, limiting the results to the matching vocabularies.
     * @param {number} page - Zero-based page number of vocabularies to retrieve.
     * @param {number} pageSize - Count of vocabularies to retrieve in each page (max 1000).
     */
    list(query?: VocabulariesQuery, page = 0, pageSize = 50) {
        var parameters = {
            page: page,
            pageSize: pageSize
        };

        if (query) {
            if (query.dataSource) {
                Object.defineProperty(parameters, 'dataSource', {
                    value: query.dataSource,
                    enumerable: true
                });
            }

            if (query.createdFromSession) {
                Object.defineProperty(parameters, 'createdFromSession', {
                    value: formatDate(query.createdFromSession),
                    enumerable: true
                });
            } 
        }
        return this._apiConnection.get('vocabulary', this.FetchTransformFunction, parameters);
    }
}