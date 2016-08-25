//Societies service used to communicate Societies REST endpoints
(function () {
  'use strict';

  angular
    .module('societies')
    .factory('SocietiesService', SocietiesService);

  SocietiesService.$inject = ['$resource'];

  function SocietiesService($resource) {
    return $resource('api/societies/:societyId', {
      societyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
