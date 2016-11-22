var chalk             = require('chalk');
var express           = require('express');
var path              = require("path");
var webpack           = require("webpack");
var webpackMiddleware = require("webpack-dev-middleware");

var app = express();
var port = 3000;

// Serve all static files in the public folder
app.use(express.static("public"));

// Serve the dynamic game bundle
app.use(webpackMiddleware(webpack({
    entry: "./index.js",
    output: { path: "/", filename: 'game.js'},
    devtool: 'source-map',
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: { presets: ['es2015']}
            },
            {
                test: /\.json$/,
                loader: 'json'
            }, 
        ],
        resolve: {
            root: [path.resolve('.')],
            extensions: ['', '.js', '.ts']
        },
    },
    }), {
    lazy: true, // recompile the bundle on each server request
    noInfo: true, // only print errors and warnings
    publicPath: "/",
    index: "index.html",
    stats: { colors: true }
}));

// Start servering
app.listen(port, function () {
    console.log(chalk.green('game dev server running on port ' + port))
})

// Handle busy port errors
process.on('uncaughtException',function (err) {
    if(err.errno === 'EADDRINUSE') {
        console.log(chalk.yellow('port ' + port + ' is busy, possibly already running the game dev server'))
        return;
    }
    console.error(err);
    return process.exit(1);
})