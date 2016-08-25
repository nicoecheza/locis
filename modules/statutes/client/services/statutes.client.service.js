//Statutes service used to communicate Statutes REST endpoints
(function () {
  'use strict';

  angular
    .module('statutes')
    .factory('StatutesService', StatutesService);

  StatutesService.$inject = ['$resource'];

  function StatutesService($resource) {
    return $resource('api/statutes/:statuteId', {
      statuteId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
