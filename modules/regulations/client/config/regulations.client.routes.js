(function () {
  'use strict';

  angular
    .module('regulations')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('regulations', {
        abstract: true,
        url: '/regulations',
        template: '<ui-view/>'
      })
      .state('regulations.create', {
        url: '/create',
        templateUrl: 'modules/regulations/client/views/form-regulation.client.view.html',
        controller: 'RegulationsController',
        controllerAs: 'vm',
        resolve: {
          regulationResolve: newRegulation
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Regulations Create'
        }
      })
      .state('regulations.edit', {
        url: '/:regulationId/edit',
        templateUrl: 'modules/regulations/client/views/form-regulation.client.view.html',
        controller: 'RegulationsController',
        controllerAs: 'vm',
        resolve: {
          regulationResolve: getRegulation
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Regulation {{ regulationResolve.name }}'
        }
      })
      .state('regulations.view', {
        url: '/:regulationId',
        templateUrl: 'modules/regulations/client/views/view-regulation.client.view.html',
        controller: 'RegulationsController',
        controllerAs: 'vm',
        resolve: {
          regulationResolve: getRegulation
        },
        data:{
          pageTitle: 'Regulation {{ articleResolve.name }}'
        }
      });
  }

  getRegulation.$inject = ['$stateParams', 'RegulationsService'];

  function getRegulation($stateParams, RegulationsService) {
    return RegulationsService.get({
      regulationId: $stateParams.regulationId
    }).$promise;
  }

  newRegulation.$inject = ['RegulationsService'];

  function newRegulation(RegulationsService) {
    return new RegulationsService();
  }
})();
