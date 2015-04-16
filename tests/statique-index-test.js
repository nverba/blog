/*global console, beforeEach, afterEach, describe, inject, module, it */

describe.skip("statique: index-service", function () { "use strict";

  var $scope, $httpBackend, Index;

  beforeEach(module('statique.index'));

  beforeEach(inject(function($injector) {

    $scope       = $injector.get('$rootScope').$new();
    $httpBackend = $injector.get('$httpBackend');

  }));

  afterEach(function() {
   $httpBackend.verifyNoOutstandingExpectation();
   $httpBackend.verifyNoOutstandingRequest();
  });

  describe("init", function () {

    afterEach(function(done) {
      Index.init().then(function () {
        done();
      });
      $httpBackend.flush();
    });

    describe("load", function () {
      
      it("tag index should be fetched", function () {
        $httpBackend.expect('GET', '/build/indexes/tags.json');
      });

      it("page0 index should be fetched", function () {
        $httpBackend.expect('GET', '/build/indexes/page0.json');
      });

    });
  });
});
