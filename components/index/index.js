'use strict';

angular.module('statique.index', [])
  .controller('IndexController', ['$http', IndexControllerFn]);

function IndexControllerFn($http) {

  var allocatePage = angular.bind(this, function allocatePage(page) {
    this.page = page.data;
  });

  function fetchJson(json) {
    return $http.get('build/indexes/' + json + '.json');
  }

  this.load = function loadPage(page) {
    fetchJson(page).then(allocatePage);
  };

  // init default index page
  fetchJson('pages/0').then(allocatePage);
}
