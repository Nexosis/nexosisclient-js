require('url-search-params-polyfill');

const chai = require('chai');
const expect = chai.expect;

describe('Polyfill tests', () => {
    it('can use url search params', (done) => {
        var parameters = { partialName: 'es' };
        var urlParams = new URLSearchParams();
        Object.keys(parameters).forEach((p) => urlParams.append(p, parameters[p]));
        expect(urlParams.toString()).to.equal('partialName=es');
        urlParams.append('startDate', '2017-06-29');
        expect(urlParams.toString()).to.equal('partialName=es&startDate=2017-06-29');
        done();
    });
});