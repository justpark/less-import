var through = require('through');
var compiler = require('./libs/compiler.js')
var fs = require('fs');

var isLessFilename = /\.less$/;

function cssComponentPlugin(browserify, options) {
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
    if (browserify._pending) {
      var tr = through();
      tr.css = through();

      browserify.on('_ready', function () {
        var b = browserify.bundle(opts, cb);
        b.on('transform', tr.emit.bind(tr, 'transform'));
        if (!cb) b.on('error', tr.emit.bind(tr, 'error'));
        b.pipe(tr);
        b.css.pipe(tr.css);
        console.log('ready', filenames);
      });
      return tr;
    }

    var stream = bundle.apply(browserify, arguments);

      console.log('css through');
    stream.css = through();
    stream.on('finish', function() {
      compiler(stream, filenames, output);
    });

    return stream;
  };

  return browserify;
}

module.exports = cssComponentPlugin;
