/*global console, beforeEach, afterEach, describe, inject, module, it */

describe("statique: Search", function () { "use strict";

  var $scope, $httpBackend, Search;

  beforeEach(module('search.service'));

  beforeEach(inject(function($injector) {

    $scope       = $injector.get('$rootScope').$new();
    $httpBackend = $injector.get('$httpBackend');
    Search       = $injector.get('Search');

  }));

  afterEach(function() {
   $httpBackend.verifyNoOutstandingExpectation();
   $httpBackend.verifyNoOutstandingRequest();
  });

  describe("tags", function () {

    it("fetches tag indexes by name", function () {
      $httpBackend.expect('GET', '/build/tags/css.json').respond(200, {});
      $httpBackend.expect('GET', '/build/tags/html.json').respond(200, {});
      Search.tags(['css', 'html']);
      $httpBackend.flush();
    });

    it("combines current tags into a list", function () {
      
    });

  });
});
