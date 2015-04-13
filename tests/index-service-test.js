/*global console, beforeEach, afterEach, describe, inject, module, it */

describe("statique:", function () { "use strict";

  var $scope, $httpBackend;

  beforeEach(inject(function($injector) {

    $scope = $injector.get('$rootScope').$new();
    $httpBackend = $injector.get('$httpBackend');

    $httpBackend.when('GET', '/build.indexes/tags.json')
      .respond({ "icons":15, "jquery":10, "http":12, "ajax":8 });

    $httpBackend.when('GET', '/build.indexes/page0.json')
      .respond({ "icons":15, "jquery":10, "http":12, "ajax":8 });

  }));

  describe("index-service:", function () {

    describe("tag index", function () {
      it("should be fetched", function () {
        $httpBackend.expect('GET', '/build/indexes/tags.json');
      });
    });
  });
});
