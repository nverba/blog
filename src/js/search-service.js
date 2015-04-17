'use strict';

var _ = require('lodash');

angular.module('search.service', ['ngNewRouter']).factory("Search", ['$router', '$http', '$q', '$httpBackend', SearchServiceFn]);

function SearchServiceFn($router, $http, $q, $httpBackend) {

  var Search = {};
  var tags   = {};
  var ready  = [];

  Search.results = [];

  Search.tags = function (newTags) {

    var list = {};
    var posts = [];

    angular.forEach(newTags, function (name) {
      if (!tags[name]) {
        ready.push($http.get('/build/tags/' + name + '.json').then(function (result) {
          tags[name] = result.data;
        }));
      }
    });

    $q.all(ready).then(function () {
      angular.forEach(_.pick(tags, newTags), function (value, key) {
        angular.forEach(value, function (url) {
          list[url] = list[url] || [];
          list[url].push(key);
        });
      });

      angular.forEach(list, function (value, key) {
        var title = _.trim(key.slice(16), '-');
        var permalink = 'posts/' + key.toLowerCase() + '.md';
        posts.push({ key: key, tags: value, title: title, permalink: permalink });
      });

      Search.results = _.sortBy(posts, function(post) {
        return 1 - post.tags.length;
      });
      
    });
  };

  return Search;

}
