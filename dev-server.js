var chalk = require('chalk');
var express = require('express');
var path = require("path");
var webpack = require("webpack");
var webpackMiddleware = require("webpack-dev-middleware");
var awesomeTsLoader = require('awesome-typescript-loader');

var app = express();
var port = 1337;
console.log(path.resolve('.'))
// Serve all static files in the public folder
app.use(express.static("public"));

// Serve the dynamic game bundle
app.use(webpackMiddleware(webpack({
    entry: "./index",
    output: { path: "/", filename: 'game.js' },
    devtool: 'source-map',
    module: {
        loaders: [
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader', exclude: /node_modules/ },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: { presets: ['es2015'] }
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
        ],
    },
    resolve: {
        root: [path.resolve('.')],
        extensions: ['', '.ts', '.tsx', '.js', '.jsx', '.json'],
        modulesDirectories: ['./node_modules']
    }
}), {
        lazy: true, // recompile the bundle on each server request
        noInfo: true, // only print errors and warnings
        publicPath: "/",
        index: "index.html",
        stats: { colors: true, errorDetails: true },
        plugins: [
            new awesomeTsLoader.CheckerPlugin()
        ]
    }));

// Start servering
app.listen(port, () => {
    console.log(chalk.green('game dev server running on port ' + port))
})

// Handle busy port errors
process.on('uncaughtException', (err) => {
    if (err.errno === 'EADDRINUSE') {
        console.log(chalk.yellow('port ' + port + ' is busy, possibly already running the game dev server'))
        return;
    }
    console.error(err);
    return process.exit(1);
})