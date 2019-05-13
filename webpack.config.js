const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

// Frontend config ==================================================
const frontConfig = {
    target: 'web',
    entry: {
        app: [
            path.resolve(__dirname, './public/js/app-frontend.js'),
        ],
    },
    output: {
        path: path.resolve(__dirname, './public/dist/'),
        filename: '[name].[contenthash].frontend.bundle.js',
    },
    watchOptions: {
        ignored: /node_modules/,
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: [/.css$|.scss$/],
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [
                                require('autoprefixer')({
                                    browsers: ['> 1%', 'last 2 versions'],
                                }),
                            ],
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: devMode,
                        },
                    },
                ],
            },
            {
                test: /\.(ico|ttf|woff|woff2|eot)(\?[\s\S]+)?$/,
                use: 'file-loader',
            },
            {
                test: /\.(gif|png|jpe?g|ico)$/i,
                use: [
                    'file-loader',
                ],
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader',
            },
            {
                test: /font-awesome\.config\.js/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'font-awesome-loader' },
                ],
            },
            {
                test: /bootstrap\/dist\/js\/umd\//,
                use: 'imports-loader?jQuery=jquery',
            },
        ],
    },
    optimization: {
        minimizer: [
            new TerserJSPlugin({}),
            new OptimizeCSSAssetsPlugin({}),
        ],
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
            Button: 'exports-loader?Button!bootstrap/js/dist/button',
            Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
            Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
            Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
            Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
            Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
            Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
            Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
            Tooltip: 'exports-loader?Tooltip!bootstrap/js/dist/tooltip',
            Util: 'exports-loader?Util!bootstrap/js/dist/util',
        }),
    ],
};

// Backend config =======================================================
const backConfig = {
    target: 'node',
    entry: {
        app: [
            path.resolve(__dirname, './app.js'),
        ],
    },
    output: {
        path: path.resolve(__dirname, './'),
        filename: 'app.backend.bundle.js',
    },
    node: {
        __dirname: true,
        __filename: true,
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
};

// Combined
module.exports = [frontConfig, backConfig];
