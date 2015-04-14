'use strict';

angular.module('index.service', ['ngNewRouter']).factory("index", ['$router', '$http', '$q', IndexServiceFn]);

function IndexServiceFn($router, $http, $q) {

  function init() {

    // Initialise service with Tags and initial Page, returns promise.all

    return $q.all([
      function () {
        return $http.get('/build/indexes/tags.json').then(function (result) {
            console.log(result.data);
          return (Index.tags = Object.keys(result.data));
        });
      },
      function () {
        return $http.get('/build/indexes/page0.json').then(function (result) {
          return (Index.page = Object.keys(result.data));
        });
      }
    ]);
  }

  var Index = { init: init };
  return Index;

}
