(function () {
  'use strict';

  describe('Regulations Controller Tests', function () {
    // Initialize global variables
    var RegulationsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      RegulationsService,
      mockRegulation;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _RegulationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      RegulationsService = _RegulationsService_;

      // create mock Regulation
      mockRegulation = new RegulationsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Regulation Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Regulations controller.
      RegulationsController = $controller('RegulationsController as vm', {
        $scope: $scope,
        regulationResolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleRegulationPostData;

      beforeEach(function () {
        // Create a sample Regulation object
        sampleRegulationPostData = new RegulationsService({
          name: 'Regulation Name'
        });

        $scope.vm.regulation = sampleRegulationPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (RegulationsService) {
        // Set POST response
        $httpBackend.expectPOST('api/regulations', sampleRegulationPostData).respond(mockRegulation);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Regulation was created
        expect($state.go).toHaveBeenCalledWith('regulations.view', {
          regulationId: mockRegulation._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/regulations', sampleRegulationPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Regulation in $scope
        $scope.vm.regulation = mockRegulation;
      });

      it('should update a valid Regulation', inject(function (RegulationsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/regulations\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('regulations.view', {
          regulationId: mockRegulation._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (RegulationsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/regulations\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup Regulations
        $scope.vm.regulation = mockRegulation;
      });

      it('should delete the Regulation and redirect to Regulations', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/regulations\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('regulations.list');
      });

      it('should should not delete the Regulation and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
