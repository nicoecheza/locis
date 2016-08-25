(function () {
  'use strict';

  describe('Regulations Route Tests', function () {
    // Initialize global variables
    var $scope,
      RegulationsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _RegulationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      RegulationsService = _RegulationsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('regulations');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/regulations');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          RegulationsController,
          mockRegulation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('regulations.view');
          $templateCache.put('modules/regulations/client/views/view-regulation.client.view.html', '');

          // create mock Regulation
          mockRegulation = new RegulationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Regulation Name'
          });

          //Initialize Controller
          RegulationsController = $controller('RegulationsController as vm', {
            $scope: $scope,
            regulationResolve: mockRegulation
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:regulationId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.regulationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            regulationId: 1
          })).toEqual('/regulations/1');
        }));

        it('should attach an Regulation to the controller scope', function () {
          expect($scope.vm.regulation._id).toBe(mockRegulation._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/regulations/client/views/view-regulation.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          RegulationsController,
          mockRegulation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('regulations.create');
          $templateCache.put('modules/regulations/client/views/form-regulation.client.view.html', '');

          // create mock Regulation
          mockRegulation = new RegulationsService();

          //Initialize Controller
          RegulationsController = $controller('RegulationsController as vm', {
            $scope: $scope,
            regulationResolve: mockRegulation
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.regulationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/regulations/create');
        }));

        it('should attach an Regulation to the controller scope', function () {
          expect($scope.vm.regulation._id).toBe(mockRegulation._id);
          expect($scope.vm.regulation._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/regulations/client/views/form-regulation.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          RegulationsController,
          mockRegulation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('regulations.edit');
          $templateCache.put('modules/regulations/client/views/form-regulation.client.view.html', '');

          // create mock Regulation
          mockRegulation = new RegulationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Regulation Name'
          });

          //Initialize Controller
          RegulationsController = $controller('RegulationsController as vm', {
            $scope: $scope,
            regulationResolve: mockRegulation
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:regulationId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.regulationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            regulationId: 1
          })).toEqual('/regulations/1/edit');
        }));

        it('should attach an Regulation to the controller scope', function () {
          expect($scope.vm.regulation._id).toBe(mockRegulation._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/regulations/client/views/form-regulation.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
