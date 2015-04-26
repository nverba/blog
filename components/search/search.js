'use strict';

var _ = require('lodash');

angular.module('search.component', ['ngNewRouter'])
  .controller('SearchController', ['$rootScope', '$location', '$http', '$q', SearchControllerFn]);

var tags   = {};
var ready  = [];

function SearchControllerFn($rootScope, $location, $http, $q) {

  var list = {};
  var posts = [];
  var params = [].concat($location.search()["tags[]"]);

  // Push promises to ready

  angular.forEach(params, function (name) {
    if (!tags[name]) {
      ready.push($http.get('/build/tags/' + name + '.json').then(function (result) {
        tags[name] = result.data;
      }));
    }
  });

  // When all tags loaded

  $q.all(ready).then(function () {
    angular.forEach(_.pick(tags, params), function (value, key) {
      angular.forEach(value, function (url) {
        list[url] = list[url] || [];
        list[url].push(key);
      });
    });

    angular.forEach(list, function (value, key) {
      var title = key.slice(16).replace(/-/g, ' ').replace(/_/g, '-');
      var link  = key.toLowerCase().replace(/_/g, '-');
      posts.push({ key: key, tags: value, title: title, link: link });
    });

    this.results = _.sortBy(posts, function(post) {
      return 1 - post.tags.length;
    });
    
  }.bind(this));
}
