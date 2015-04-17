/*global console, beforeEach, afterEach, describe, inject, module, it */

describe("statique: Search", function () { "use strict";

  var $scope, $httpBackend, Search, $http;

  beforeEach(module('search.service'));

  beforeEach(inject(function($injector) {

    $scope       = $injector.get('$rootScope').$new();
    $httpBackend = $injector.get('$httpBackend');
    $http        = $injector.get('$http');
    Search       = $injector.get('Search');

  }));

  afterEach(function() {
   $httpBackend.verifyNoOutstandingExpectation();
   $httpBackend.verifyNoOutstandingRequest();
  });

  describe("tags", function () {

    it("fetches tag indexes by name", function () {
      $httpBackend.expect('GET', '/build/tags/css.json').respond(200, ["2014-04-24-1032-multi-lateral-non-volatile-intranet","2014-05-04-0716-adaptive-optimizing-core","2014-06-01-1031-front-line-upward-trending-moratorium","2014-08-17-1400-profound-encompassing-ability","2014-08-22-0710-phased-discrete-standardization","2014-08-31-0906-ergonomic-multi-state-success","2014-09-08-0004-multi-tiered-transitional-encoding","2014-09-10-0556-front-line-discrete-policy","2014-10-05-1135-user-centric-asymmetric-monitoring","2014-10-11-0237-synergistic-incremental-migration","2014-10-23-0617-secured-even-keeled-local-area-network","2014-10-23-1600-optimized-local-frame","2014-12-09-1718-ergonomic-encompassing-circuit","2014-12-19-1220-realigned-multi-tasking-task-force","2014-12-23-0028-cross-group-interactive-application","2014-12-31-2158-open-architected-non-volatile-help-desk","2015-03-07-0925-customizable-responsive-orchestration"]);
      $httpBackend.expect('GET', '/build/tags/html.json').respond(200, ["2014-04-23-2340-progressive-demand-driven-approach","2014-06-01-1031-front-line-upward-trending-moratorium","2014-07-13-2027-customer-focused-transitional-policy","2014-09-09-0608-configurable-solution-oriented-projection","2014-09-14-0843-up-sized-eco-centric-matrix","2014-09-19-1539-advanced-tertiary-conglomeration","2014-09-23-1855-adaptive-bifurcated-time-frame","2014-10-21-0509-business-focused-content-based-throughput","2014-10-23-0617-secured-even-keeled-local-area-network","2014-10-31-1820-ameliorated-even-keeled-help-desk","2014-11-22-1152-user-friendly-needs-based-open-system","2015-01-08-0422-sharable-6th-generation-software","2015-01-31-2331-profound-holistic-knowledge-user","2015-02-09-0416-universal-demand-driven-paradigm","2015-03-09-2053-total-needs-based-monitoring"]);
      Search.tags(['css', 'html']);
      $httpBackend.flush();
    });

    it("combines current tags into a list", function () {
      
    });

    describe("list", function () {

      it("creates a tag index backend", function () {

      });

      it("has a next link", function () {
        
      });

      it("provides a list of posts as posts:", function () {
        
      });

      it("the posts are ordered by number of matched tags", function () {
        
      });

      it("does not have a previous link", function () {
        
      });

      it("paginates results", function () {
        
      });

    });

  });
});
