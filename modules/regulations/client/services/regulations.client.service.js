//Regulations service used to communicate Regulations REST endpoints
(function () {
  'use strict';

  angular
    .module('regulations')
    .factory('RegulationsService', RegulationsService);

  RegulationsService.$inject = ['$resource'];

  function RegulationsService($resource) {
    return $resource('api/regulations/:regulationId', {
      regulationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
