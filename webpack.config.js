const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const CleanTerminalWebpackPlugin = require("clean-terminal-webpack-plugin");

const { aliasFromTsConfig } = require("./alias-from-tsconfig");

const alias = aliasFromTsConfig();

console.log("Aliases:");
console.log(JSON.stringify(alias, 2, 2));

const config = {
    entry: "./src/index.tsx",
    output: {
        filename: "./assets/[name].[hash].js",
        publicPath: process.env.PUBLIC_PATH || "/"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
        alias
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
                exclude: /\/node_modules/
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|png)$/,
                use: ["file-loader"]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader" // translates CSS into CommonJS
                    },
                    {
                        loader: "less-loader" // compiles Less to CSS
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader" // translates CSS into CommonJS
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "RD ERP",
            filename: "index.html",
            template: path.resolve(__dirname, "./public/index.html")
        }),
        new webpack.DefinePlugin({
            API_URL: JSON.stringify(process.env.RD_ERP_API_URL),
            LOGIN_URL: JSON.stringify(process.env.RD_ERP_LOGIN_URL)
        }),
        new CleanTerminalWebpackPlugin()
    ],
    devServer: {
        port: 8888,
        host: "localhost",
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, "dist"),
        publicPath: process.env.PUBLIC_PATH || "/",
        disableHostCheck: true,
        stats: "errors-only"
    },
    devtool: "source-map"
};

module.exports = config;
