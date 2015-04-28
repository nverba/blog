angular.module('statique:filters', [])
  .filter('parseKey', function(){
    return function (text) {
      return text.replace(/_/g, '-').toLowerCase();
    };
  }).filter('parseUrlDate', function(){
    return function (text) {
      return new Date(text.slice(0, 10));
    };
  });
