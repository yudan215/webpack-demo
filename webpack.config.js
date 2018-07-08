const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin= require('html-webpack-plugin'); //html文件创建
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //样式分离
const PurifyCssWebpack = require('purifycss-webpack');//过滤冗余CSS
const glob = require('glob');
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports={
    devtool: 'eval-source-map',
    //入口文件的配置项
    entry: {
        app: ['babel-polyfill','./src/main.js'],
        jquery:'jquery',
    },
    //出口文件的配置项
    output:{
        path: path.resolve(__dirname, 'dist'),//输出的路径，用了Node语法
        filename: '[name].js'//输出的文件名称,[name]根据入口文件的名称，打包成相同的名称
    },
    //模块：例如解读CSS,图片如何转换，压缩
    module:{
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ]
            },

            {
                test:/\.(png|jpg|gif)/ ,
                use:[{
                    loader:'url-loader',
                    options:{
                        limit:10240,
                        outputPath:'img/',
                    }
                }]
            },
            {
                test: /\.(htm|html)$/i,
                use:[ 'html-withimg-loader']
            },
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader,'css-loader','less-loader']
            },
            {
                test:/\.(jsx|js)$/,
                use:{
                    loader:'babel-loader',
                },
                exclude:/node_modules/
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: "initial",         // 必须三选一： "initial" | "all"(默认就是all) | "async"
            minSize: 0,                // 最小尺寸，默认0
            minChunks: 1,              // 最小 chunk ，默认1
            maxAsyncRequests: 1,       // 最大异步请求数， 默认1
            maxInitialRequests: 1,    // 最大初始化请求书，默认1
            name: () => {
            },              // 名称，此选项课接收 function
            cacheGroups: {                 // 这里开始设置缓存的 chunks
                priority: "0",                // 缓存组优先级 false | object |
                vendor: {                   // key 为entry中定义的 入口名称
                    chunks: "initial",        // 必须三选一： "initial" | "all" | "async"(默认就是异步)
                    test: /react|lodash/,     // 正则规则验证，如果符合就提取 chunk
                    name: "vendor",           // 要缓存的 分隔出来的 chunk 名称
                    minSize: 0,
                    minChunks: 1,
                    enforce: true,
                    maxAsyncRequests: 1,       // 最大异步请求数， 默认1
                    maxInitialRequests: 1,    // 最大初始化请求书，默认1
                    reuseExistingChunk: true   // 可设置是否重用该chunk（查看源码没有发现默认值）
                }
            }
        }
    },
    //插件，用于生产模版和各项功能
    plugins:[
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new PurifyCssWebpack({ //消除css冗余代码
            paths:glob.sync(path.join(__dirname, 'src/*.html'))
        }),
        new htmlWebpackPlugin({
            minify:{ removeAttributeQuotes:true },//minify：是对html文件进行压缩，removeAttributeQuotes是却掉属性的双引号
            hash:true, //为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS
            template:'./index.html' //是要打包的html模版路径和文件名称
        }),
        new CleanWebpackPlugin(['dist']),
        new webpack.BannerPlugin('JSPang版权所有，看官方免费视频到jspang.com收看'),
        new Webpack.ProvidePlugin({
            $:'jquery'
        })
    ],
    //配置webpack开发服务功能
    devServer:{
        //设置基本目录结构
        contentBase: path.resolve(__dirname, 'dist'),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host:'localhost',
        //服务端压缩是否开启
        compress:true,
        //配置服务端口号
        port:1717
    }
}