require('angular');
require('angular-sanitize');
require('angular-new-router');

require('./index-service.js');

angular.module('statique', ['ngNewRouter'])
  .controller('RouteController', ['$router', RouteController]);

function RouteController($router) {
  $router.config([
    { 
      path: '/',
      components: {
        // 'default': 'index',
        // 'tags': 'tag'
      }
    }
  ]);
}
