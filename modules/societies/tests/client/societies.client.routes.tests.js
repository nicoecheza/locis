(function () {
  'use strict';

  describe('Societies Route Tests', function () {
    // Initialize global variables
    var $scope,
      SocietiesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SocietiesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SocietiesService = _SocietiesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('societies');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/societies');
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
          SocietiesController,
          mockSociety;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('societies.view');
          $templateCache.put('modules/societies/client/views/view-society.client.view.html', '');

          // create mock Society
          mockSociety = new SocietiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Society Name'
          });

          //Initialize Controller
          SocietiesController = $controller('SocietiesController as vm', {
            $scope: $scope,
            societyResolve: mockSociety
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:societyId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.societyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            societyId: 1
          })).toEqual('/societies/1');
        }));

        it('should attach an Society to the controller scope', function () {
          expect($scope.vm.society._id).toBe(mockSociety._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/societies/client/views/view-society.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SocietiesController,
          mockSociety;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('societies.create');
          $templateCache.put('modules/societies/client/views/form-society.client.view.html', '');

          // create mock Society
          mockSociety = new SocietiesService();

          //Initialize Controller
          SocietiesController = $controller('SocietiesController as vm', {
            $scope: $scope,
            societyResolve: mockSociety
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.societyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/societies/create');
        }));

        it('should attach an Society to the controller scope', function () {
          expect($scope.vm.society._id).toBe(mockSociety._id);
          expect($scope.vm.society._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/societies/client/views/form-society.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SocietiesController,
          mockSociety;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('societies.edit');
          $templateCache.put('modules/societies/client/views/form-society.client.view.html', '');

          // create mock Society
          mockSociety = new SocietiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Society Name'
          });

          //Initialize Controller
          SocietiesController = $controller('SocietiesController as vm', {
            $scope: $scope,
            societyResolve: mockSociety
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:societyId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.societyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            societyId: 1
          })).toEqual('/societies/1/edit');
        }));

        it('should attach an Society to the controller scope', function () {
          expect($scope.vm.society._id).toBe(mockSociety._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/societies/client/views/form-society.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
