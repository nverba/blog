/*global console, beforeEach, afterEach, describe, inject, module, it */

describe("statique:", function () { "use strict";

  var $scope;

  beforeEach(inject(function($rootScope) {
    $scope = $rootScope.$new();
  }));

  describe("index-service:", function () {

    describe("ready", function () {
      it("should return", function () {
        return true;
      });
    });
  });
});
