//Normativas service used to communicate Normativas REST endpoints
(function () {
  'use strict';

  angular
    .module('normativas')
    .factory('NormativasService', NormativasService);

  NormativasService.$inject = ['$resource'];

  function NormativasService($resource) {
    return $resource('api/normativas/:normativaId', {
      normativaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
