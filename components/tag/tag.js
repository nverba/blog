'use strict';

var _ = require('lodash');

angular.module('statique.tag', ['search.service'])
  .controller('TagController', ['$http', '$rootScope', 'Search', '$router', TagControllerFn]);

function TagControllerFn($http, $rootScope, Search, $router) {

  this.tags_index = [];
  var last_tags = [];

  var searchString = angular.bind(this, function searchStringFn() {
    return this.search_string;
  });

  var updateTags = angular.bind(this, function (newValue) { if (!newValue) { return; }

    var words = _.uniq(_.words(newValue));

    this.search_word = _.last(_.difference(words, this.tags_index));
    this.tags        = _.without(words, this.search_word);
    this.filter      = filterTags(this.search_word, this.tags);

    if (!_.isEqual(this.tags, last_tags)) {
      Search.tags(this.tags);
      last_tags = this.tags;
    }

  });

  var allocateTags = angular.bind(this, function (response) {
    return (this.tags_index = _.keys(response.data));
  });

  function filterTags(search_word, matches) {
    return function (tag) {
      return _.indexOf(matches, tag) && (new RegExp(['^' + search_word], 'i')).test(tag);
    };
  }

  this.addTag = function addTagFn(tag) {
    this.search_string = this.search_string.replace(/\S+$/, tag + ' ');
  };

  this.init = $http.get('build/indexes/tags/tags.json').then(allocateTags);
  $rootScope.$watchCollection(searchString, updateTags);

}
