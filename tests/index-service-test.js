/*global console, beforeEach, afterEach, describe, inject, module, it */

describe.skip("statique: index-service", function () { "use strict";

  var $scope, $httpBackend, Index;

  beforeEach(module('index.service'));

  beforeEach(inject(function($injector) {

    $scope       = $injector.get('$rootScope').$new();
    $httpBackend = $injector.get('$httpBackend');
    Index        = $injector.get('index');

    $httpBackend.when('GET', '/build/indexes/tags.json')
      .respond({ "icons":15, "jquery":10, "http":12, "ajax":8 });

    $httpBackend.when('GET', '/build/indexes/page0.json')
      .respond({"posts":[{"title":"Robust asynchronous matrices","author":"Michale","permalink":"posts/2014-06-11-1130-robust-asynchronous-matrices","key":"2014-06-11-1130-robust-asynchronous-matrices","tags":["html","png","jquery","css"]},{"title":"Ameliorated transitional core","author":"Michale","permalink":"posts/2014-06-11-2329-ameliorated-transitional-core","key":"2014-06-11-2329-ameliorated-transitional-core","tags":["javascript","chrome","canvas","svg"]}],"previous":false,"next":"page1"});

    $httpBackend.when('GET', '/build/indexes/page1.json')
      .respond({"posts":[{"title":"Robust asynchronous matrices","author":"Michale","permalink":"posts/2014-06-11-1130-robust-asynchronous-matrices","key":"2014-06-11-1130-robust-asynchronous-matrices","tags":["html","png","jquery","css"]},{"title":"Ameliorated transitional core","author":"Michale","permalink":"posts/2014-06-11-2329-ameliorated-transitional-core","key":"2014-06-11-2329-ameliorated-transitional-core","tags":["javascript","chrome","canvas","svg"]}],"previous":"page0","next":"page2"});

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

  describe("loaded:", function () {

    beforeEach(function (done) {
      Index.init().then(function () {
        done();
      });
      $httpBackend.flush();
    });

    describe("first page:", function () {
            
      it("exposes current index page posts as array", function () {
        assert.equal(Object.prototype.toString.call(Index.page.posts), "[object Array]");
      });

      it("previous does not generate any http requests", function () {
        Index.previous(); 
      });

      it("next: fetches next page", function () {
        $httpBackend.expect('GET', '/build/indexes/page1.json')
          .respond({});
        Index.next();
        $httpBackend.flush();
      });

      it("exposes current index page posts as array", function () {
        assert.equal(Object.prototype.toString.call(Index.page.posts), "[object Array]");
      });

      it("next state is true", function () {
        assert.equal(Index.hasNext, true);
      });

      it("previous state is false", function () {
        assert.equal(Index.hasPrev, false);
      });

    });

    describe("next", function () {
      
      beforeEach(function (done) {
        Index.next().then(function () {
          done();
        });
        $httpBackend.flush();
      });

      describe("page", function () {

        it("next state is true", function () {
          assert.equal(Index.hasNext, true);
        });

        it("previous state is true", function () {
          assert.equal(Index.hasPrev, true);
        });
      });
    });

    describe("tags:", function () {

      beforeEach(function () {

      });

      it("exposes tags as array of strings", function () {
        assert.equal(Object.prototype.toString.call(Index.tags), "[object Array]");
        assert.equal(typeof Index.tags[0], 'string');
      });

      describe("tag search:", function () {
        
        it("exposes current search results page as array", function () {
          // test
        });
      });
    });



  });

  // describe("tag search:", function () {
    
  //   it("exposes current search results page as array", function () {
  //     // test
  //   });

  //   it("exposes next", function () {
  //     // test
  //   });

  //   it("exposes previous", function () {
  //     // test
  //   });

  //   it("exposes next state", function () {
  //     // test
  //   });

  //   it("exposes previous state", function () {
  //     // test
  //   });

  //   it("paginates results", function () {
  //     // test
  //   });

  //   it("reverts to origin page when tag search cancelled", function () {
  //     // test
  //   });

  // });

});
