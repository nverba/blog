'use strict';

angular.module('index.component', [])
  .controller('IndexController', ['$http', IndexControllerFn]);

function IndexControllerFn($http) {

  var allocatePage = angular.bind(this, function allocatePage(result) {
    this.page = result.data;
  });

  function fetchJson(id) {
    return $http.get('build/indexes/pages/' + id + '.json');
  }

  this.load = function loadPage(id) {
    fetchJson(id).then(allocatePage);
  };

  // init default index page
  fetchJson('0').then(allocatePage);
}
