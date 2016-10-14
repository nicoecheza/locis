(function () {
  'use strict';

  angular
    .module('statutes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('statutes', {
        abstract: true,
        url: '/statutes',
        template: '<ui-view/>'
      })
      .state('statutes.list', {
        url: '',
        templateUrl: 'modules/statutes/client/views/list-statutes.client.view.html',
        controller: 'StatutesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Statutes List'
        }
      })
      .state('statutes.create', {
        url: '/create',
        templateUrl: 'modules/statutes/client/views/form-statute.client.view.html',
        controller: 'CreateStatuteController',
        controllerAs: 'vm',
        resolve: {
          statuteResolve: newStatute
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Statutes Create'
        }
      })
      .state('statutes.edit', {
        url: '/:statuteId/edit',
        templateUrl: 'modules/statutes/client/views/form-statute.client.view.html',
        controller: 'StatutesController',
        controllerAs: 'vm',
        resolve: {
          statuteResolve: getStatute
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Statute {{ statuteResolve.name }}'
        }
      })
      .state('statutes.view', {
        url: '/:statuteId',
        templateUrl: 'modules/statutes/client/views/view-statute.client.view.html',
        controller: 'StatutesController',
        controllerAs: 'vm',
        resolve: {
          statuteResolve: getStatute
        },
        data:{
          pageTitle: 'Statute {{ articleResolve.name }}'
        }
      })
      .state('regulations.list', {
        url: '',
        templateUrl: 'modules/statutes/client/views/list-regulations.client.view.html',
        controller: 'RegulationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Regulations List'
        }
      });
  }

  getStatute.$inject = ['$stateParams', 'StatutesService'];

  function getStatute($stateParams, StatutesService) {
    return StatutesService.get({
      statuteId: $stateParams.statuteId
    }).$promise;
  }

  newStatute.$inject = ['StatutesService'];

  function newStatute(StatutesService) {
    return new StatutesService();
  }
})();
