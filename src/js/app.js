require('angular');
require('angular-sanitize');
require('angular-new-router');

require('../../components/tag/tag.js');
require('../../components/index/index.js');

angular.module('statique', ['ngNewRouter', 'statique.tag', 'statique.index'])
  .controller('RouteController', ['$router', RouteController]);

function RouteController($router) {
  $router.config([
    { 
      path: '/',
      components: {
        'default': 'index',
        'tags': 'tag'
      }
    }
  ]);
}
