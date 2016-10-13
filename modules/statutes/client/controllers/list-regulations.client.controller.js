(function () {
  'use strict';

  angular
    .module('statutes')
    .controller('RegulationsListController', RegulationsListController);

  RegulationsListController.$inject = ['RegulationsService', 'Authentication'];

  function RegulationsListController(RegulationsService, Authentication) {
    var vm = this;

    vm.permission = Authentication.user.roles.indexOf('admin') !== -1;

    vm.regulations = RegulationsService.query();
  }
})();
