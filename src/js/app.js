require('angular');
require('angular-sanitize');
require('angular-new-router');

require('./search-service.js');

require('../../components/tag/tag.js');
require('../../components/index/index.js');

angular.module('statique', ['ngNewRouter', 'statique.tag', 'statique.index', 'search.service'])
  .controller('RouteController', ['$router', RouteController]);

function RouteController($router) {
  $router.config([
    { 
      path: '/posts',
      components: {
        'default': 'index',
        'tags': 'tag'
      }
    }
  ]);
}
