
if (process.env.NODE_ENV === 'integration') {
    global.endpointUrl = process.env.NEXOSIS_API_TESTURI;
} else {
    global.endpointUrl = 'http://localhost:8080';

    let server;
    before(function (done) {
        const talkback = require("talkback");

        const opts = {
            host: process.env.NEXOSIS_API_TESTURI,
            path: "./tests/fixtures/cassettes",
            ignoreHeaders: ['api-key'],
            summary: true,
            record: true,
        };

        server = talkback(opts);
        server.start(() => {
            console.log("Talkback Started");
            done();
        });
    });

    after(function () {
        console.log('Talkback stopped.')
        server.close();
    });

}
