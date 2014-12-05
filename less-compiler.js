var fs = require('fs');
var _ = require('underscore');
var less = require('less');
var path = require('path');

function lessCompile(stream, filenames, output) {

  if (output !== undefined) {
    stream.css.pipe(fs.createWriteStream(output));
  }

  finishCompile = _.after(filenames.length, function(){
    while(filenames.length) {filenames.pop();}

    try {
      stream.css.queue(null);
    } catch (err) {
      stream.emit('error', err);
      stream.css.emit('error', err);
    }
  });

  filenames.forEach(function(filename){
    console.log('file: ', filename);
    fs.readFile(filename, function (err, data) {
      less.render(data.toString(), {
        compress: true,
        paths: [path.dirname(filename)]
      }).then(function(css) {
        console.log('css: ', arguments);
        try {
          stream.css.queue(css.css);
        } catch (err) {
          stream.emit('error', err);
          stream.css.emit('error', err);
        }
        finishCompile();
      }, function(err){
        console.log(err);
      });
    });
  });
}

module.exports = lessCompile;
