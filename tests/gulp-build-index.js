/*global console, beforeEach, afterEach, describe, inject, module, it */

// This test assumes the sample index data has been built - $ gulp build.index.test

describe("statique:build-index", function () { "use strict";

  var $scope, $httpBackend, firstIndex, lastIndex;

  beforeEach(inject(function($injector) {

    $scope = $injector.get('$rootScope').$new();
    $httpBackend = $injector.get('$httpBackend');

    firstIndex = window.__fixtures__.page0;
    lastIndex = window.__fixtures__.page7;

  }));

  describe("gulp:", function () {

    describe("first index file", function () {

      it("should not have a previous link", function () {
        assert.equal(firstIndex.previous, false);
      });

      it("should have a next link", function () {
        assert.equal(firstIndex.next, 'page1');
      });

    });

    describe("last index file", function () {

      it("should have a previous link", function () {
        assert.equal(lastIndex.next, false);
      });

      it("should not have a next link", function () {
        assert.equal(lastIndex.previous, 'page6');
      });

    });

    describe("index file", function () {

      it("should have an array of posts", function () {
        assert.equal(Object.prototype.toString.call(firstIndex.posts), "[object Array]");
      });

      describe("posts", function () {

        it("should have an array of tags", function () {
          assert.equal(Object.prototype.toString.call(firstIndex.posts[0].tags), "[object Array]");
        });

        it("should have an author", function () {
          assert.equal(typeof firstIndex.posts[0].author, "string");
        });

        it("should have a permalink", function () {
          assert.equal(typeof firstIndex.posts[0].permalink, "string");
        });

      });

    });

  });
});
