const Webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

module.exports = {
    mode: process.env.NODE_ENV,
    target: "web",
    entry: {
        app: "./src/main.ts"
    },
    module: {
        rules: [
            {
                // Vue single file components
                test: /\.vue$/,
                use: ["vue-loader"]
            },
            {
                // TypeScript
                test: /\.ts$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            appendTsSuffixTo: [/\.vue$/],
                            transpileOnly: true
                        }
                    }
                ]
            },
            {
                // HTML
                // exclude index.html which is processed by HtmlWebpackPlugin
                test: /\.html$/,
                exclude: /index\.html$/,
                use: "html-loader"
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new ForkTsCheckerWebpackPlugin({
            async: false,
            typescript: {
                extensions: {
                    vue: true
                },
                mode: "readonly"
            },
            logger: { infrastructure: 'console' }
        }),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: "index.html",
            minify: false,
            hash: true
        }),
        new Webpack.ProgressPlugin({
            activeModules: true
        }),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all"
                }
            }
        }
    },
    resolve: {
        alias: {
            "vue$": "vue/dist/vue.common.js"
        },
        extensions: [".ts", ".js", ".vue"],
    },
    devServer: {
        inline: true, // This enables HMR but breaks IE11
        historyApiFallback: {
            verbose: false
        },
        overlay: {
            warnings: false,
            errors: true
        }
    }
};
