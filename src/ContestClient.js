import ApiClientBase from './ApiClientBase';

/**
 * Class for interacting with Contest specific features of the Nexosis API.
 */
export default class ContestClient extends ApiClientBase {

    getContest(sessionId, transformFunc) {
        return this._apiConnection.get(`sessions/${sessionId}/contest`, transformFunc);
    }

    getContestant(sessionId, contestantId, transformFunc) {
        return this._apiConnection.get(`sessions/${sessionId}/contest/contestants/${contestantId}`, transformFunc);
    }

    getChampion(sessionId, transformFunc) {
        return this._apiConnection.get(`sessions/${sessionId}/contest/champion`, transformFunc);
    }

    getSelection(sessionId, transformFunc) {
        return this._apiConnection.get(`sessions/${sessionId}/contest/selection`, transformFunc);
    }

    listContestants(sessionId, transformFunc) {
        return this._apiConnection.get(`sessions/${sessionId}/contest/contestants`, transformFunc);
    }
}