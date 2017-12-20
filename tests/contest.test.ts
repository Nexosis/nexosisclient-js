import SessionClient from '../src/SessionClient';
import ContestClient from '../src/ContestClient';
import { mochaAsync } from './mochaAsync';
import { expect } from 'chai';
import 'mocha';

describe('Session tests', () => {
    var client = new ContestClient({ endpoint: global.endpointUrl, key: process.env.NEXOSIS_API_TESTKEY });
    var sessionClient = new SessionClient({ endpoint: global.endpointUrl, key: process.env.NEXOSIS_API_TESTKEY });
    let sessionId;

    before(mochaAsync(async () => {
        const value = await sessionClient.list();
        sessionId =
            value.items
                .filter(session => session.status === 'completed' && session.type === 'forecast')
                .reverse()[0].sessionId;
    }));

    it('should retrieve the contest', mochaAsync(async () => {
        const contest = await client.getContest(sessionId);
        expect(contest).to.have.property('championMetric').that.is.a('string');
    })).timeout(10000);

    it('should retrieve a contestant', mochaAsync(async () => {
        const contest = await client.getContest(sessionId);
        const contestantId = contest.contestants[0].id;

        const contestant = await client.getContestant(sessionId, contestantId);
        expect(contestant.data).not.to.undefined;
    }));

    it('should retrieve a champion', mochaAsync(async () => {
        const champion = await client.getChampion(sessionId);

        expect(champion.metrics).not.to.be.undefined;
    }));

    it('should get selection info', mochaAsync(async () => {
        const selection = await client.getSelection(sessionId);

        expect(selection).not.to.be.undefined;
    }));

    it('should list contestants', mochaAsync(async () => {
        const contestants = await client.listContestants(sessionId);

        expect(contestants).not.to.be.undefined;
    }));
});