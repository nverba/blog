'use strict';

angular.module('search.component', ['ngNewRouter', 'search.service'])
  .controller('SearchController', ['Search', '$rootScope', '$routeParams', SearchControllerFn]);

function SearchControllerFn(Search, $rootScope, $routeParams) {

  console.log($routeParams);

  var searchResults = function () {
    return Search.results;
  };

  var allocateResults = angular.bind(this, function (results) {
    this.results = results;
  });

  $rootScope.$watchCollection(searchResults, allocateResults);

}
