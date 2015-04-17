'use strict';

angular.module('statique.search', ['statique.search'])
  .controller('SearchController', ['Search', '$rootScope', SearchControllerFn]);

function SearchControllerFn(Search, $rootScope) {

  var searchResults = function () {
    return Search.results;
  };

  var allocateResults = angular.bind(this, function (results) {
    this.results = results;
  });

  $rootScope.$watchCollection(searchResults, allocateResults);

}
