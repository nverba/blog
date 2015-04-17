/*global console, beforeEach, afterEach, describe, inject, module, it */

describe("statique.tag", function () { "use strict";

  var $scope, $controller, $httpBackend, tagCtrl;

  beforeEach(module('statique.tag'));

  beforeEach(inject(function($injector) {

    $scope       = $injector.get('$rootScope').$new();
    $controller  = $injector.get('$controller');
    tagCtrl      = $controller('TagController', { $scope: $scope });
    $httpBackend = $injector.get('$httpBackend');

    $httpBackend.when('GET', 'build/indexes/tags.json')
      .respond({"graphics":21,"ember":26,"css":20,"html":16,"backbone":12,"svg":12,"chrome":14,"photoshop":14,"http":17,"icons":20,"ajax":16,"php":18,"angularjs":21,"jquery":19,"png":16,"javascript":17,"canvas":16});

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe("on init", function () {

    it("tag index should be fetched", function () {
      $httpBackend.expect('GET', 'build/indexes/tags.json').respond({});
      $httpBackend.flush();
    });

    describe("after init", function () {

      beforeEach(function () {
        tagCtrl.init.then(function () {
          tagCtrl.search_string = "css, html, jqu";
        });
        $httpBackend.flush();
      });

      it("matches tags from tag_index", function () {
        assert.deepEqual(tagCtrl.tags, ["css", "html"]);
      });

      it("exposes the search_word partial string for filtering", function () {
        assert.deepEqual(tagCtrl.search_word, "jqu");
      });

    });

  });
});
