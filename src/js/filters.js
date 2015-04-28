angular.module('statique:filters', []).filter('parsekey', function(){
  return function (text) {
    return text.replace(/_/g, '-').toLowerCase();
  };
});
