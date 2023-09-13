const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: "development",
    watchOptions: {
        ignored: /node_modules/,
    },
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, '..', 'build'),
        filename: 'bundle.js',
        publicPath: '/public'
    },
    resolve: {
        fallback: {
            "timers": require.resolve("timers-browserify"),
        },
        extensions: [
            '.ts', 
            '.js',
            '.json',
            '.scss',
        ],
    },
    module: {
        rules: [
            { test: /\.txt$/, use: 'raw-loader' },
            {
                test: /\.module\.scss$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        },
                    },
                    { loader: 'sass-loader' },
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                        },
                    },
                    { loader: 'sass-loader' },
                ],
            },
            { test: /\.ts$/, use: 'ts-loader' },
            {
                test: /\.m?jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env', '@babel/react'],
                    plugins: ['@babel/plugin-transform-runtime'],
                    
                  }
                }
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            "React": "react",
            //process: 'process/browser',
        }),
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({ template: './view/index.html' })
    ],
};