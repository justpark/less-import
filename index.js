var through = require('through');
var less = require('gulp-less');
var gulp = require('gulp');
var path = require('path');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer-core');

var LessPluginCleanCSS = require("less-plugin-clean-css"),
    cleancss = new LessPluginCleanCSS({advanced: true});

var isLessFilename = /\.less$/;


var parsedFiles = [];

module.exports = function(moduleOptions){
  moduleOptions = moduleOptions || {};

  return function (browserify, options) {
    options = options || {};

    var output = options.output || options.o;
    var filenames = [];

    // Transform adds filename to list
    browserify.transform(function(filename) {
      if (!isLessFilename.exec(filename)) return through();

      filenames.push(filename);

      return through(
        function() {},
        function() {
          this.queue('');
          this.queue(null);
        });
    });

    var bundle = browserify.bundle;

    // Override browserify bundle
    browserify.bundle = function() {

      var stream = bundle.apply(browserify, arguments);

      browserify.on('file', function(file){
        if (isLessFilename.exec(file) && parsedFiles.indexOf(file) === -1) {
          parsedFiles.push(file);
          moduleOptions.gulp.src(file)
            .pipe(less({
              plugins: [cleancss]
            }))
            .on('error', function(err) {
              console.log(err.message);
            })
            .pipe(postcss([
              autoprefixer({ browsers: ['last 2 version'] })
            ]))
            .pipe(gulp.dest(moduleOptions.dest));
        }
      });
      stream.on('finish', function(){
        parsedFiles = [];
      });

      return stream;
    };

    return browserify;
  };
};
