// Karma configuration
// Generated on Sat Jun 27 2015 15:22:42 GMT+1000 (AEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'src/main/resources/static/js/kingfisherApp/js/angular/angular.js',
      'src/main/resources/static/js/kingfisherApp/js/angular-loader/angular-loader.js',
      'src/main/resources/static/js/kingfisherApp/js/angular-resource/angular-resource.js',

      'src/main/resources/static/js/kingfisherApp/js/angular-mocks/angular-mocks.js',
      'src/main/resources/static/js/kingfisherApp/js/jquery/dist/jquery.js',
      'src/main/resources/static/js/kingfisherApp/js/bootstrap/dist/js/bootstrap.js',
      'src/main/resources/static/js/kingfisherApp/js/d3/d3.js',
      'src/main/resources/static/js/kingfisherApp/js/d3.phylogram/newick.js',
      'src/main/resources/static/js/kingfisherApp/js/lodash/lodash.js',
      'src/main/resources/static/js/kingfisherApp/js/spectrum/spectrum.js',
      'src/main/resources/static/js/kingfisherApp/*.js',
      'src/main/resources/static/js/kingfisherApp/services/*.js',
      'src/main/resources/static/js/kingfisherApp/controller/*.js',
      'src/main/resources/static/js/kingfisherApp/directives/*.js',
      'src/main/resources/static/js/kingfisherApp/directives/templates/*.html',
      'src/test/resources/static/js/*.js'

    ],


    // list of files to exclude
    exclude: [

      'src/test/resources/static/js/fishPlotTreeMakerTest.js',
      'src/test/resources/static/js/plotsFactoryTest.js'








    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/main/resources/static/js/kingfisherApp/directives/templates/*.html' : 'html2js'

    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'html'],


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
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,
    plugins: [
      // Karma will require() these plugins
      'karma-jasmine',
      'karma-jasmine-html-reporter',
      'karma-chrome-launcher']





  })
}
