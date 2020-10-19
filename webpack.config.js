const path = require('path')
const CoypWebpackPlugins = require('copy-webpack-plugin')
const EntryExtractPlugin = require('./entry-extract-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const ABSOLUTE_PATH = process.cwd()

module.exports = {
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
        
    ],
    optimization: {
        minimize: true,
    }
}