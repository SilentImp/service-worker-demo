var gulp = require('gulp')
    , build = require('gulp-gh-pages');


gulp.task('deploy', function () {
  console.log('deploying');
  return gulp.src('source/**')
    .pipe(build({
      branch:     'gh-pages',
      cacheDir:   'gh-cache',
      remoteUrl:  'git@github.com:SilentImp/service-worker-demo.git'
    }).on('error', function(){
      console.log('error', arguments);
    }));
});
