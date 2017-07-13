const path = require('path');

const merge = require('webpack-merge');

const parts = require('./webpack.parts');


const PATHS = {
    src: path.join(__dirname,'src'),
    lib: path.join(__dirname,'lib')
};

const commonConfig = merge([
    {
        entry: {
            app: ['isomorphic-fetch',__dirname],
        },
        output: {
            path: PATHS.lib,
            filename: '[name].js',
        }
    }
]);

module.exports = (env) => {
    const pages = [
        parts.page({title: "es6-client"}),
    ];

    return pages.map(page => merge(commonConfig,page));
};