const path = require('path');
const {
    version
} = require('./package.json');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FilemanagerWebpackPlugin = require('filemanager-webpack-plugin');

module.exports = (env = {}) => {
    return {
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
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            // minimize: {
                            //     reduceTransforms: false
                            // }
                        }
                    },
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
            new MiniCssExtractPlugin({
                filename: 'css/[name].css'
            }),
            new webpack.ProvidePlugin({
                $: '../lib/zepto.js'
            }),
            new CopyWebpackPlugin([{
				from : './src/js/phaser.min.js',
				to : 'js',
			},{
				from : './src/img',
				to : 'img',
				ignore : ['.gitkeep']
			}]),
            new HtmlWebpackPlugin({
                minify: {
                    collapseWhitespace: true,
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: true
                },
                template: './src/index.html'
            }),
            new FilemanagerWebpackPlugin({
                onEnd: env.zip ? [{
                    copy: [{
                        source: path.resolve(__dirname, 'dist'),
                        destination: path.resolve(__dirname, 'tmp_for_zip/dist')
                    }]
                }, {
                    archive: [{
                        source: path.resolve(__dirname, 'tmp_for_zip'),
                        destination: path.resolve(__dirname, 'dist.zip')
                    }]
                }, {
                    delete: [
                        path.resolve(__dirname, 'tmp_for_zip')
                    ]
                }] : []
            })
        ]
    }
};
