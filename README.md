less-import
===========

Browserify plugin to import less files from javascript source


#### GulpFile

``` JavaScript
var lessImport = require('less-import');
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var bundler = browserify('./src/javascript/app.js')
  // Activating less-import plugin
  .plugin(lessImport);
  
var stream = bundler.bundle();

// Building JS source
stream.pipe(source('bundle.js'))
  .pipe(gulp.dest('./build/'));

// Building CSS source
stream.css.pipe(source('bundle.css'))
  .pipe(gulp.dest('./build/'));
```

#### Code

`mycomponent.js`
``` JavaScript
// .. require JavaScript source

require('./mycomponent.less');

```

`mycomponent.less`
``` Less
// .. import additional less files
@import 'sub-component.less'

.my-component {
  /* ... */
}
```
