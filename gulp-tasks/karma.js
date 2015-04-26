var gulp  = require('gulp');
var karma = require('karma').server;

var karmaCommonConf = {

  browsers: ['Chrome'],
  frameworks: ['mocha', 'chai', 'chai-as-promised'],
  autoWatch: true,
  preprocessors: {
    './tests/fake_data/**/*.json': ['json_fixtures']
  },
  files: [
    './build/js/*.js',
    './node_modules/angular-mocks/angular-mocks.js',
    './tests/*.js',
    'tests/fake_data/**/*.json'
  ],
  jsonFixturesPreprocessor: {
    stripPrefix: 'tests/fake_data/indexes/'
  },
  client: {
    mocha: {
      ui: 'bdd'
    }
  }
};

gulp.task('test:karma', function (done) {
  karma.start(karmaCommonConf, done);
});
