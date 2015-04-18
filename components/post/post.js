'use strict';

var marked  = require('marked');

angular.module('statique.post', ['ngNewRouter', 'ngSanitize'])
  .controller('PostController', ['$http', '$routeParams', PostControllerFn]);

function PostControllerFn ($http, $routeParams) {

  $http.get('posts/' + $routeParams.id + '.md' )
    .then(function(res){
      this.markdown =  marked(res.data);
    }.bind(this));
}
