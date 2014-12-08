less-import
===========

Browserify plugin to import less files from javascript source


#### GulpFile

To use less-import, you only need to activate the pluggin, passing a destination directory, and the gulp instance.

``` JavaScript
var lessImport = require('less-import');
var gulp = require('gulp');
var browserify = require('browserify');

var bundler = browserify('./src/javascript/app.js')
  // Activating less-import plugin
  .plugin(lessImport({
    dest: 'path/to/directory',
    gulp: gulp
  }))

// Building JS source
bundler.bundle().pipe(gulp.dest('./build/'));
```

#### Code

In your code, you can import `.less` files as normal, they will be parsed and saved in the directory specified.

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


