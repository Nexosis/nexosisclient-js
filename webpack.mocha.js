const path = require('path');
const merge = require('webpack-merge');

const parts = require('./webpack.parts');

const testConfig = merge([
    {
        entry: {
            tests: ['isomorphic-fetch',path.join(__dirname,'tests')],
        },
    }
]);

module.exports = (env) => {
    //return merge(commonConfig);
    const pages = [
        parts.page({title: "Mocha tests"}),
    ];

    return pages.map(page => merge(testConfig,page));
};