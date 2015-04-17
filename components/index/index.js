'use strict';

angular.module('statique.index', [])
  .controller('IndexController', ['$http', IndexControllerFn]);

function IndexControllerFn($http) {

  var allocatePage = angular.bind(this, function allocatePage(page) {
    this.page = page.data;
  });

  function fetchJson(json) {
    return $http.get('build/page-index/' + json + '.json');
  }

  this.load = function loadPage(page) {
    fetchJson(page).then(allocatePage);
  };

  // init default index page
  fetchJson('page0').then(allocatePage);
}
