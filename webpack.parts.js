const HtmlWebpackPlugin = require('html-webpack-plugin');

const BabiliPlugin = require('babili-webpack-plugin');

exports.page = ({
    path = '',
    template = require.resolve(
        'html-webpack-plugin/default_index.ejs'
    ),
    title,
} = {}) => ({
    plugins: [
        new HtmlWebpackPlugin({
            filename: `${path && path + '/'}index.html`,
            template,
            title,
        }),
    ],
});

exports.generateSourceMaps = ({ type }) => ({
    devtool: type,
});

exports.loadJavaScript = ({ include, exclude }) => ({
    module: {
        rules: [
        {
            test: /\.js$/,
            include,
            exclude,
            loader: 'babel-loader',
            options: {
                // Enable caching for improved performance during
                // development.
                // It uses default OS directory by default. If you need
                // something more custom, pass a path to it.
                // I.e., { cacheDirectory: '<path>' }
                cacheDirectory: true,
            },
        },
        ],
    },
});

exports.minifyJavaScript = () => ({
    plugins: [
        new BabiliPlugin(),
    ],
});