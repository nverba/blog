'use strict';

var marked = require('marked');
var fm     = require("html-frontmatter");

angular.module('post.component', ['ngNewRouter', 'ngSanitize'])
  .controller('PostController', ['$http', '$routeParams', '$sce', PostControllerFn]);

function PostControllerFn ($http, $routeParams, $sce) {

  $http.get('posts/' + $routeParams.id + '.md' )
    .then(function(res){
      this.meta = fm(res.data);
      this.markdown =  $sce.trustAsHtml(marked(res.data));
    }.bind(this));
}
