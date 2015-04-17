'use strict';

var _ = require('lodash');

angular.module('statique.tag', [])
  .controller('TagController', ['$http', '$rootScope', TagControllerFn]);

function TagControllerFn($http, $rootScope) {

    console.log('init');

  this.tags_index = [];
  var last_tags = [];

  var searchString = angular.bind(this, function searchStringFn() {
    return this.search_string;
  });

  var updateTags = angular.bind(this, function (newValue) { if (!newValue) { return; }

    var words = _.uniq(_.words(newValue));

    this.search_word = _.last(_.difference(words, this.tags_index));
    this.tags = _.without(words, this.search_word);

    console.log(this.search_word);

      console.log(this.tags_index);

    if (!_.isEqual(this.tags, last_tags)) {
      last_tags = this.tags;
    }

  });

  var allocateTags = angular.bind(this, function (response) {
    return (this.tags_index = _.keys(response.data));
  });

  this.init = $http.get('build/indexes/tags/tags.json').then(allocateTags);
  $rootScope.$watchCollection(searchString, updateTags);

}
