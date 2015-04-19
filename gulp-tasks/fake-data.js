var gulp  = require('gulp');
var faker = require('faker');
var del   = require('del');
var fs    = require('fs');

gulp.task('clean.fake.data', function (cb) {
  del([
    './tests/fake_data/posts/*.*',
    './tests/fake_data/tags/*.*',
    './tests/fake_data/indexes/pages/*.*'
  ], cb);
});

gulp.task('fake.data', ['clean.fake.data'], function () {

  var tags = ["php", "javascript", "html", "css", "jquery", "angularjs", "chrome", "http", "svg", "photoshop", "canvas", "png", "icons", "graphics", "ajax", "ember", "backbone"];

  var author = faker.name.firstName();

  for(var x=0; x<82; x++) {

    var random_tags = {};
    for (var i=0; i <=3; i++) {
      random_tags[faker.random.array_element(tags)] = true;
    }

    var date  = faker.date.past().toISOString().slice(0, 16).replace(/T/, '-').replace(/:/, '');
    var title = faker.company.catchPhrase().replace(/\//, '-');
    var key   = date + '-' + title.replace(/-/g, '_').replace(/\s+/g, '-');
    var permalink = date + '-' + title.replace(/\s+/g, '-').toLowerCase();

var fake_data = "<!--\n\
title: " + title.charAt(0).toUpperCase() + title.slice(1) + "\n\
author: " + author + "\n\
permalink: " + permalink + "\n\
key: " + key + "\n\
tags: [" + Object.keys(random_tags).toString() + "]\n\
-->\n\
\n" + faker.lorem.paragraphs();

    fs.writeFile('./posts/' + permalink + '.md', fake_data);

  }
});
