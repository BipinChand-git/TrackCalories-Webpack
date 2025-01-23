const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode : 'development',
    entry : './src/app.js',
    output : {
        path : path.resolve(__dirname, 'dist'),
        filename : 'bundle.js',
    },
    devServer : {
        static :  {
            directory : path.resolve(__dirname, 'dist'),
        },
        port : 3000,
        open : true,
        hot : true,
        compress : true,
        historyApiFallback : true,
    },
    module : {
        rules : [
            {
                test : /\.css$/,
                use : [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test : /\.(png|svg|jpg|jpeg|gif|ico)$/,
                use : [
                    {
                        loader : 'file-loader',
                        options : {
                            name : '[name].[ext]',
                            outputPath : 'asset',
                        },
                    },
                ],
            },
            {
                test : /\.js$/,
                exclude : /node_modules/,
                use : {
                    loader : 'babel-loader',
                    options : {
                        presets : ['@babel/preset-env'],
                    }
                }
            }
        ]
    },
    plugins : [
        new HtmlWebpackPlugin({
            title : 'Calories-Tracker',
            filename : 'index.html',
            template : './src/index.html',
        }),
        new MiniCssExtractPlugin(),
    ]
};