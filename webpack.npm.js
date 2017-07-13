const path = require('path');
const merge = require('webpack-merge');

const parts = require('./webpack.parts');

const PATHS = {
    src: __dirname,
    build: path.join(__dirname, 'dist'),
};

const commonConfig = merge([
    {
        entry: {
            client: ['isomorphic-fetch', PATHS.src],
        },
        output: {
            path: PATHS.build,
            library: 'Nexosis API Client',
            libraryTarget: 'var',
        },
    },
    parts.generateSourceMaps({ type: 'source-map' }),
    parts.loadJavaScript({ include: PATHS.lib }),
]);

const libraryConfig = merge([
    commonConfig,
    {
        output: {
        filename: 'nexosis-api-client.js',
        },
    },
]);

const libraryMinConfig = merge([
    commonConfig,
    {
        output: {
        filename: 'nexosis-api-client.min.js',
        },
    },
    parts.minifyJavaScript({ useSourceMap: true }),
]);

module.exports = [
    libraryConfig,
    libraryMinConfig,
];