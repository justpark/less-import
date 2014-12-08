var through = require('through');
var less = require('gulp-less');
var gulp = require('gulp');
var source = require('vinyl-source-stream');

var isLessFilename = /\.less$/;

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
    browserify.bundle = function(opts, cb) {

      var stream = bundle.apply(browserify, arguments);
      stream.on('finish', function() {
        if (filenames.length) {
          gulp.src(filenames)
            .pipe(less())
            .pipe(source(moduleOptions.destName))
            .pipe(gulp.dest(moduleOptions.destPath));

          filenames = [];
        }
      });

      return stream;
    };

    return browserify;
  };
};
