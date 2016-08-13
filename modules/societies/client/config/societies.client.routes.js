(function () {
  'use strict';

  angular
    .module('societies')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('societies', {
        abstract: true,
        url: '/societies',
        template: '<ui-view/>'
      })
      .state('societies.list', {
        url: '',
        templateUrl: 'modules/societies/client/views/list-societies.client.view.html',
        controller: 'SocietiesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Societies List'
        }
      })
      .state('societies.create', {
        url: '/create',
        templateUrl: 'modules/societies/client/views/form-society.client.view.html',
        controller: 'SocietiesController',
        controllerAs: 'vm',
        resolve: {
          societyResolve: newSociety
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Societies Create'
        }
      })
      .state('societies.edit', {
        url: '/:societyId/edit',
        templateUrl: 'modules/societies/client/views/form-society.client.view.html',
        controller: 'SocietiesController',
        controllerAs: 'vm',
        resolve: {
          societyResolve: getSociety
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Society {{ societyResolve.name }}'
        }
      })
      .state('societies.view', {
        url: '/:societyId',
        templateUrl: 'modules/societies/client/views/view-society.client.view.html',
        controller: 'SocietiesController',
        controllerAs: 'vm',
        resolve: {
          societyResolve: getSociety
        },
        data:{
          pageTitle: 'Society {{ articleResolve.name }}'
        }
      });
  }

  getSociety.$inject = ['$stateParams', 'SocietiesService'];

  function getSociety($stateParams, SocietiesService) {
    return SocietiesService.get({
      societyId: $stateParams.societyId
    }).$promise;
  }

  newSociety.$inject = ['SocietiesService'];

  function newSociety(SocietiesService) {
    return new SocietiesService();
  }
})();
