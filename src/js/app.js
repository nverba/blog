require('angular');
require('angular-sanitize');
require('angular-new-router');

require('./search-service.js');

require('../../components/tag/tag.js');
require('../../components/index/index.js');
require('../../components/search/search.js');

angular.module('statique', ['ngNewRouter', 'statique.tag', 'statique.index', 'statique.search', 'search.service'])
  .controller('RouteController', ['$router', RouteController]);

function RouteController($router) {
  $router.config([
    { 
      path: '/',
      components: {
        'default': 'index',
        'tags': 'tag'
      }
    },
    { 
      path: '/search',
      components: {
        'default': 'search',
        'tags': 'tag'
      }
    }
  ]);
}
