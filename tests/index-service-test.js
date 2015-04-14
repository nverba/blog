/*global console, beforeEach, afterEach, describe, inject, module, it */

describe("statique:", function () { "use strict";

  var $scope, $httpBackend, Index;

  beforeEach(module('index.service'));

  beforeEach(inject(function($injector, _index_) {

    $scope       = $injector.get('$rootScope').$new();
    $httpBackend = $injector.get('$httpBackend');
    Index        = $injector.get('index');

    $httpBackend.when('GET', '/build/indexes/tags.json')
      .respond({ "icons":15, "jquery":10, "http":12, "ajax":8 });

    $httpBackend.when('GET', '/build/indexes/page0.json')
      .respond({"posts":[{"title":"Reverse-engineered fault-tolerant initiative","author":"Michale","permalink":"posts/2014-04-15-0401-reverse-engineered-fault-tolerant-initiative","key":"2014-04-15-0401-reverse-engineered-fault-tolerant-initiative","tags":["graphics","ember","css"]},{"title":"Cloned contextually-based hierarchy","author":"Michale","permalink":"posts/2014-04-15-2355-cloned-contextually-based-hierarchy","key":"2014-04-15-2355-cloned-contextually-based-hierarchy","tags":["html","backbone","graphics"]},{"title":"Switchable didactic contingency","author":"Michale","permalink":"posts/2014-05-03-0143-switchable-didactic-contingency","key":"2014-05-03-0143-switchable-didactic-contingency","tags":["svg","ember","chrome","photoshop"]},{"title":"Distributed cohesive solution","author":"Michale","permalink":"posts/2014-05-04-0828-distributed-cohesive-solution","key":"2014-05-04-0828-distributed-cohesive-solution","tags":["http","icons","backbone","ajax"]},{"title":"Multi-channelled bifurcated alliance","author":"Michale","permalink":"posts/2014-05-17-0932-multi-channelled-bifurcated-alliance","key":"2014-05-17-0932-multi-channelled-bifurcated-alliance","tags":["php","angularjs","http","jquery"]},{"title":"User-centric modular concept","author":"Michale","permalink":"posts/2014-05-19-1837-user-centric-modular-concept","key":"2014-05-19-1837-user-centric-modular-concept","tags":["angularjs","icons","jquery"]},{"title":"Programmable mission-critical functionalities","author":"Michale","permalink":"posts/2014-06-01-0149-programmable-mission-critical-functionalities","key":"2014-06-01-0149-programmable-mission-critical-functionalities","tags":["angularjs","svg","backbone"]},{"title":"User-friendly fault-tolerant forecast","author":"Michale","permalink":"posts/2014-06-02-2152-user-friendly-fault-tolerant-forecast","key":"2014-06-02-2152-user-friendly-fault-tolerant-forecast","tags":["jquery","chrome","icons","svg"]},{"title":"Robust asynchronous matrices","author":"Michale","permalink":"posts/2014-06-11-1130-robust-asynchronous-matrices","key":"2014-06-11-1130-robust-asynchronous-matrices","tags":["html","png","jquery","css"]},{"title":"Ameliorated transitional core","author":"Michale","permalink":"posts/2014-06-11-2329-ameliorated-transitional-core","key":"2014-06-11-2329-ameliorated-transitional-core","tags":["javascript","chrome","canvas","svg"]}],"previous":false,"next":"page1"});

  }));

  beforeEach(function (done) {
    Index.init().then(function () {
      done();
    });
    $scope.$digest();
  });

  describe("index-service:", function () {

    describe("init:", function () {
      
      it("tag index should be fetched", function () {
        $httpBackend.expect('GET', '/build/indexes/tags.json');
      });

      it("page0 index should be fetched", function () {
        $httpBackend.expect('GET', '/build/indexes/page0.json');
      });

      describe("indexes:", function () {
        
        it("exposes current index page as array", function () {
          // test
        });

        it("exposes next", function () {
          // test
        });

        it("exposes previous", function () {
          // test
        });

        it("exposes next state", function () {
          // test
        });

        it("exposes previous state", function () {
          // test
        });

        it("paginates results", function () {
          // test
        });

      });

      describe("tags:", function () {

        it("exposes tags as an array", function () {
          //assert.equal(Object.prototype.toString.call(Index.tags), "[object Array]");
        });
      });

      describe("tag search:", function () {
        
        it("exposes current search results page as array", function () {
          // test
        });

        it("exposes next", function () {
          // test
        });

        it("exposes previous", function () {
          // test
        });

        it("exposes next state", function () {
          // test
        });

        it("exposes previous state", function () {
          // test
        });

        it("paginates results", function () {
          // test
        });

        it("reverts to origin page when tag search cancelled", function () {
          // test
        });

      });

    });
  });
});
