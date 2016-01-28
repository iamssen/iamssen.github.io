var gulp = require('gulp')
var Builder = require('systemjs-builder')

gulp.task('build.vendor', function () {
  var builder = new Builder({
    baseURL: "."
  })
  builder.loadConfigSync('./config.js')
  builder.bundle('es6-shim + es6-promise + angular2/core + angular2/common + angular2/platform/browser + angular2/router + angular2/http + angular2-reflow + d3 + d3tip + d3tip/dist/d3tip.css! + jquery + rxjs', 'dist/vendor.js')
  //builder.bundle('es6-shim + es6-promise + d3 + d3tip + d3tip/dist/d3tip.css! + jquery', 'dist/vendor.js')
})

gulp.task('build.web', function () {
  var builder = new Builder({
    baseURL: ".",
    paths: {
      "impl:*": "app/impl.web/*"
    }
  })
  builder.loadConfigSync('./config.js')
  builder.bundle('app - dist/vendor.js', 'dist/app.web.js')
})

gulp.task('build.electron', function () {
  var builder = new Builder({
    baseURL: __dirname,
    paths: {
      "impl:*": "app/impl.electron/*"
    }
  })
  builder.loadConfigSync('./config.js')
  builder.bundle('app - dist/vendor.js', 'dist/app.electron.js')
})
