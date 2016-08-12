(function () {
  'use strict';

  angular
    .module('normativas')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('normativas', {
        abstract: true,
        url: '/normativas',
        template: '<ui-view/>'
      })
      .state('normativas.list', {
        url: '',
        templateUrl: 'modules/normativas/client/views/list-normativas.client.view.html',
        controller: 'NormativasListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Normativas List'
        }
      })
      .state('normativas.create', {
        url: '/create',
        templateUrl: 'modules/normativas/client/views/form-normativa.client.view.html',
        controller: 'NormativasController',
        controllerAs: 'vm',
        resolve: {
          normativaResolve: newNormativa
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Normativas Create'
        }
      })
      .state('normativas.edit', {
        url: '/:normativaId/edit',
        templateUrl: 'modules/normativas/client/views/form-normativa.client.view.html',
        controller: 'NormativasController',
        controllerAs: 'vm',
        resolve: {
          normativaResolve: getNormativa
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Normativa {{ normativaResolve.name }}'
        }
      })
      .state('normativas.view', {
        url: '/:normativaId',
        templateUrl: 'modules/normativas/client/views/view-normativa.client.view.html',
        controller: 'NormativasController',
        controllerAs: 'vm',
        resolve: {
          normativaResolve: getNormativa
        },
        data:{
          pageTitle: 'Normativa {{ articleResolve.name }}'
        }
      });
  }

  getNormativa.$inject = ['$stateParams', 'NormativasService'];

  function getNormativa($stateParams, NormativasService) {
    return NormativasService.get({
      normativaId: $stateParams.normativaId
    }).$promise;
  }

  newNormativa.$inject = ['NormativasService'];

  function newNormativa(NormativasService) {
    return new NormativasService();
  }
})();
