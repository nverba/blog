'use strict';

var marked  = require('marked');

angular.module('post.component', ['ngNewRouter', 'ngSanitize'])
  .controller('PostController', ['$http', '$routeParams', '$sce', PostControllerFn]);

function PostControllerFn ($http, $routeParams, $sce) {

  //debugger;

  $http.get('posts/' + $routeParams.id + '.md' )
    .then(function(res){
      this.markdown =  $sce.trustAsHtml(marked(res.data));
    }.bind(this));
}
