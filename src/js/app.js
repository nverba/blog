require('angular');
require('angular-sanitize');
require('angular-new-router');

require('./search-service.js');

require('../../components/tag/tag.js');
require('../../components/post/post.js');
require('../../components/posts/posts.js');
require('../../components/search/search.js');

angular.module('statique', ['ngNewRouter', 'posts.component', 'post.component', 'search.component', 'tag.component', 'search.service'])
  .controller('RouteController', ['$router', RouteController]);

function RouteController($router) {

  $router.config([
    { path: '/', redirectTo: '/posts' },
    { 
      path: '/posts',
      components: {
        'default': 'posts',
        'tags': 'tag'
      },
      dynamic: true
    },
    { 
      path: '/post/:id',
      components: {
        'default': 'post',
        'tags': 'tag'
      }
    },
    { 
      path: '/search',
      components: {
        'default': 'search',
        'tags': 'tag'
      },
      dynamic: true
    }
  ]);
}
