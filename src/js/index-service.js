'use strict';

angular.module('index.service', ['ngNewRouter']).factory("index", ['$router', '$http', '$q', IndexServiceFn]);

function IndexServiceFn($router, $http, $q) {

  $http.get('/build/indexes/tags.json');

  return {

    
    
  };

}
