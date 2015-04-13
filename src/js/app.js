require('angular');
require('angular-sanitize');
require('angular-new-router');

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
