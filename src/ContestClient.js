import ApiClientBase from './ApiClientBase';

/**
 * Class for interacting with Contest specific features of the Nexosis API.
 * Note that the endpoint called by this client is not available under the community plan.
 * Please upgrade and use the Paid Subscription key in order to use this client.
 */
export default class ContestClient extends ApiClientBase {

    /**
     * Get detailed data science information generated by a session.
     * 
     * @param {string} sessionId  - The session to retrieve contest information from
     * @param {function} transformFunc - function to transform results data from the request
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/5a2af0a8adf47c0d20245a62
     */
    getContest(sessionId, transformFunc) {
        return this._apiConnection.get(`sessions/${sessionId}/contest`, transformFunc);
    }

    /**
     * Get a specific contestant algorithm, and the test data used in scoring the algorithm.
     * 
     * @param {string} sessionId  - The session to retrieve contestant information from
     * @param {string} contestantId - The contestant to retrieve information from
     * @param {function} transformFunc - function to transform results data from the request
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/5a2af0a8adf47c0d20245a66 
     */
    getContestant(sessionId, contestantId, transformFunc) {
        return this._apiConnection.get(`sessions/${sessionId}/contest/contestants/${contestantId}`, transformFunc);
    }

    /**
     * Gets the champion of a contest, and the test data used in scoring the algorithm.
     * 
     * @param {string} sessionId  - The session to retrieve champion information from
     * @param {function} transformFunc - function to transform results data from the request
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/5a2af0a8adf47c0d20245a63
     */
    getChampion(sessionId, transformFunc) {
        return this._apiConnection.get(`sessions/${sessionId}/contest/champion`, transformFunc);
    }

    /**
     * Gets the selection criteria that is used to determine which algorithms were executed.
     * 
     * @param {string} sessionId  - The session to retrieve champion information from
     * @param {function} transformFunc - function to transform results data from the request
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/5a2af0a8adf47c0d20245a64
     */
    getSelection(sessionId, transformFunc) {
        return this._apiConnection.get(`sessions/${sessionId}/contest/selection`, transformFunc);
    }

    /**
     * Lists the contestant algorithms which were executed for this contest.
     * 
     * @param {string} sessionId  - The session to retrieve champion information from
     * @param {function} transformFunc - function to transform results data from the request
     * @see https://developers.nexosis.com/docs/services/98847a3fbbe64f73aa959d3cededb3af/operations/5a2af0a8adf47c0d20245a65
     */
    listContestants(sessionId, transformFunc) {
        return this._apiConnection.get(`sessions/${sessionId}/contest/contestants`, transformFunc);
    }
}