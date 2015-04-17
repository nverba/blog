'use strict';

var _ = require('lodash');

angular.module('search.service', ['ngNewRouter']).factory("Search", ['$router', '$http', SearchServiceFn]);

function SearchServiceFn($router, $http) {

  var Search = {};
  var tags   = {};

  Search.tags = function (newTags) {

    angular.forEach(newTags, function (name) {
      if (!tags[name]) {
        $http.get('/build/tags/' + name + '.json').then(function (result) {
          tags[name] = result.data;
        });
        
      }
    });
    
  };

  return Search;

}
