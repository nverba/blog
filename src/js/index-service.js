'use strict';

angular.module('index.service', ['ngNewRouter']).factory("index", ['$router', '$http', '$q', IndexServiceFn]);

function IndexServiceFn($router, $http, $q) {

  var Index = {};

  Index.init = function init() {

    // Initialise service with Tags and initial Page, returns promise.all

    return $q.all([
      allocateJson('tags', 'tags', function (data) {
        return Object.keys(data);
      }),
      allocateJson('page', 'page0').then(updateIndex)
    ]);
  };

  // apply target json to named Index element

  function allocateJson(name, target, modifier) {
    return $http.get('/build/indexes/' + target + '.json').then(function (result) {
      return (Index[name] = modifier ? modifier(result.data) : result.data);
    });
  }

  function updateIndex(page) {

    // define navigation functions

    angular.forEach(['next', 'previous'], function (navigation) {
      Index[navigation] = function () {
        if (Index.page[navigation]) {
          return allocateJson('page', Index.page[navigation]).then(updateIndex);
        }
      };
    });

    // update navigation state

    Index.hasNext = !!page.next;
    Index.hasPrev = !!page.previous;
  }

  return Index;

}
