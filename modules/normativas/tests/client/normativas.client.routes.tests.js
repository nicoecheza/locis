(function () {
  'use strict';

  describe('Normativas Route Tests', function () {
    // Initialize global variables
    var $scope,
      NormativasService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _NormativasService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      NormativasService = _NormativasService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('normativas');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/normativas');
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
          NormativasController,
          mockNormativa;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('normativas.view');
          $templateCache.put('modules/normativas/client/views/view-normativa.client.view.html', '');

          // create mock Normativa
          mockNormativa = new NormativasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Normativa Name'
          });

          //Initialize Controller
          NormativasController = $controller('NormativasController as vm', {
            $scope: $scope,
            normativaResolve: mockNormativa
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:normativaId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.normativaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            normativaId: 1
          })).toEqual('/normativas/1');
        }));

        it('should attach an Normativa to the controller scope', function () {
          expect($scope.vm.normativa._id).toBe(mockNormativa._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/normativas/client/views/view-normativa.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          NormativasController,
          mockNormativa;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('normativas.create');
          $templateCache.put('modules/normativas/client/views/form-normativa.client.view.html', '');

          // create mock Normativa
          mockNormativa = new NormativasService();

          //Initialize Controller
          NormativasController = $controller('NormativasController as vm', {
            $scope: $scope,
            normativaResolve: mockNormativa
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.normativaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/normativas/create');
        }));

        it('should attach an Normativa to the controller scope', function () {
          expect($scope.vm.normativa._id).toBe(mockNormativa._id);
          expect($scope.vm.normativa._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/normativas/client/views/form-normativa.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          NormativasController,
          mockNormativa;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('normativas.edit');
          $templateCache.put('modules/normativas/client/views/form-normativa.client.view.html', '');

          // create mock Normativa
          mockNormativa = new NormativasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Normativa Name'
          });

          //Initialize Controller
          NormativasController = $controller('NormativasController as vm', {
            $scope: $scope,
            normativaResolve: mockNormativa
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:normativaId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.normativaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            normativaId: 1
          })).toEqual('/normativas/1/edit');
        }));

        it('should attach an Normativa to the controller scope', function () {
          expect($scope.vm.normativa._id).toBe(mockNormativa._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/normativas/client/views/form-normativa.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
