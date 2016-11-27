// Karma configuration
// Generated on Sun Oct 30 2016 00:13:33 GMT-0400 (EDT)
var path = require("path");

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon'],


    // list of files / patterns to load in the browser
    files: [
      './specs/*Spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './specs/*Spec.js': ['webpack']
    },

    webpack: {
    	module: {
        noParse: [
          /node_modules\/sinon\//,
        ],
    		loaders: [
    			{
    				test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
    				loader: "babel-loader",
            query: {
              presets: ["babel-preset-es2015"].map(require.resolve)
            }
    			}
    		]
    	},
      resolveLoader: {
        root: path.join(__dirname, 'node_modules')
      },
      resolve: {
        alias: {
          sinon: 'sinon/pkg/sinon',
        },
      }
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'], //['Chrome', 'Firefox', 'PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
