const path = require('path')
const webpack = require('webpack')
const CoypWebpackPlugins = require('copy-webpack-plugin')
const EntryExtractPlugin = require('./entry-extract-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const ABSOLUTE_PATH = process.cwd()
const deuggable = process.env.BUILD_TYPE !== 'release' 

module.exports = {
    watch: true,
    watchOptions: {
        //默认为空，不监听的文件或者文件夹，支持正册匹配
        ignored:/node_modules/,
        //监听到变化发生后会等到300ms再去执行，默认300ms
        aggregateTimeout: 300,
        //判断文件是否发生变化是通过不停轮循系统指定文件有没有变化实现的
        //默认每秒问1000次
        poll: 1000
    },
    mode: deuggable ? 'none' : 'production',
    devtool: deuggable ? 'inline-source-map' : 'source-map',
    context: path.resolve(ABSOLUTE_PATH, 'src'),
    entry: {
        app: './app.js',
        // 'pages/home/index': './pages/home/index.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(ABSOLUTE_PATH, 'dist'),
        chunkLoadTimeout: 3000,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            useRelativePath: true,
                            name: `[path][name].wxss`,
                            context: path.resolve('src')
                        }
                    },
                    'extract-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.json$/,
                include: /src/,
                type: 'javascript/auto',
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            useRelativePath: true,
                            name: `[path][name].json`,
                            context: path.resolve('src')
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new EntryExtractPlugin(),
        new MiniCssExtractPlugin({filename: '[name].wxss', chunkFilename: '[name].wxss'}),
        new CoypWebpackPlugins(
            {
                patterns: [
                    {
                        from: '**/*.wxml',
                        toType: 'dir'
                    },
                    {
                        from: '**/*.json',
                        toType: 'dir'
                    }
                ]

            }),
        new CleanWebpackPlugin({
            dry: true,
            verbose: true,
        }),
        new webpack.EnvironmentPlugin({
            NODE_ENV: JSON.stringify(process.env.NODE_ENV) || 'developement',
            BUILD_TYPE: JSON.stringify(process.env.BUILD_TYPE) || 'debug'
        }),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: 'common',
            minChunks: 2,
            minSize: 0
        },
        /// runtime.js plugin
        runtimeChunk: {
            name: 'runtime'
        },
        minimize: true
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9090
    }
}