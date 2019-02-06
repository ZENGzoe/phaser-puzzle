const path = require('path');
const {
    version
} = require('./package.json');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env = {}) => {
    return {
        devServer: {
            contentBase: path.join(__dirname, 'src'),
            compress: true,
            host: 'localhost',
            open: env.open,
            port: 8087,
            watchContentBase: true,
            watchOptions: {
                ignored: /node_modules/
            }
        },
        entry: {
            index: './src/js/index.js'
        },
        output: {
            filename: 'js/[name].js',
            path: path.resolve(__dirname, 'dist')
        },
        module: {
            rules: [{
                test: /\.js$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                loader: 'babel-loader'
            }, {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'node_modules/whatwg-fetch')
                ],
                loader: 'babel-loader'
            }, {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'node_modules/@jmfe/jm-service')
                ],
                loader: 'babel-loader'
            }, {
                test: /\.s?css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            }, {
                test: /\.(jpe?g|png|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'img/'
                }
            }]
        },
        plugins: [
            new CleanWebpackPlugin([
                './dist',
                './dist.zip'
            ]),
            new webpack.BannerPlugin(`v${version}`),
            new webpack.ProvidePlugin({
                $: '../lib/zepto.js'
            }),
            new CopyWebpackPlugin([{
				from : './src/js/phaser.min.js',
				to : 'js',
			}]),
            new HtmlWebpackPlugin({
                template: './src/index.html'
            })
        ]
    }
};
