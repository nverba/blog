'use strict';

angular.module('search.component', ['search.service'])
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
