const webpack = require("webpack");
const path = require("path");
const helpers = require("./webpack.helpers.js");

let config = {
    entry: helpers.root("src/app/App.js"),
    resolve: {
        extensions: [".js"],
        modules: [helpers.root("node_modules")]

    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            },
            {
                test: /\.html?/,
                exclude: /node_modules/,
                loader: "html-loader"
            }
        ]
    }
};

module.exports = config;
