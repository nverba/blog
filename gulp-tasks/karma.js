var gulp  = require('gulp');
var karma = require('karma').server;

var karmaCommonConf = {

  browsers: ['Chrome'],
  frameworks: ['mocha'],
  autoWatch: true,
  files: [
    './build/js/*.js',
    './node_modules/angular-mocks/angular-mocks.js',
    './tests/*.js'
  ],
  client: {
    mocha: {
      ui: 'bdd'
    }
  }
};

gulp.task('karma', function (done) {
  karma.start(karmaCommonConf, done);
});
