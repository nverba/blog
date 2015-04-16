/*global console, beforeEach, afterEach, describe, inject, module, it */

describe("statique.tag", function () { "use strict";

  var $scope, $controller, $httpBackend, tagCtrl;

  beforeEach(module('statique.tag'));

  beforeEach(inject(function($injector) {

    $scope       = $injector.get('$rootScope').$new();
    $controller  = $injector.get('$controller');
    tagCtrl      = $controller('TagController', { $scope: $scope });
    $httpBackend = $injector.get('$httpBackend');

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe("stuff", function () {

    describe("init", function () {

      it("tag index should be fetched", function () {
        //
      });

    });

  });
});
