'use strict';

angular.module('index.service', ['ngNewRouter']).factory("index", ['$router', '$http', '$q', IndexServiceFn]);

function IndexServiceFn($router, $http, $q) {

  var Index = {};

  Index.init = function init() {

    // Initialise service with Tags and initial Page, returns promise.all

    return $q.all([
      $http.get('/build/indexes/tags.json').then(function (result) {
        return (Index.tags = Object.keys(result.data));
      }),
      $http.get('/build/indexes/page0.json').then(function (result) {
        return (Index.page = result.data);
      })
    ]);
  };

  return Index;

}
