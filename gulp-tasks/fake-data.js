var gulp  = require('gulp');
var faker = require('faker');
var del   = require('del');
var fs    = require('fs');

gulp.task('clean.fake.data', function (cb) {
  del([
    './tests/fake_data/posts/*.*',
  ], cb);
});

gulp.task('fake.data', ['clean.fake.data'], function () {

  var tags = ["php", "javascript", "html", "css", "jquery", "angularjs", "chrome", "http", "svg", "photoshop", "canvas", "png", "icons", "graphics", "ajax", "ember", "backbone"];

  var author = faker.name.firstName();

  var random_tags = {};
  for (var i=0; i <=3; i++) {
    random_tags[faker.random.array_element(tags)] = true;
  }

  for(var x=0; x<82; x++) { 

    var date = faker.date.past().toISOString().slice(0, 16).replace(/T|:/g, '-');
    var title = faker.company.catchPhrase();
    var key = date + '-' + title.replace(/\s/g, '-').toLowerCase();
    var permalink = key.toLowerCase();

var fake_data = "<!--\n\
title: " + title.charAt(0).toUpperCase() + title.slice(1) + "\n\
author: " + author + "\n\
permalink: posts/" + permalink + "\n\
key: " + key + "\n\
tags: [" + Object.keys(random_tags).toString() + "]\n\
-->\n\
\n" + faker.lorem.sentences();

    fs.writeFile('./tests/fake_data/posts/' + permalink + '.md', fake_data);

  }
});
