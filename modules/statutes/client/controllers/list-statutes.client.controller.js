(function () {
  'use strict';

  angular
    .module('statutes')
    .controller('StatutesListController', StatutesListController);

  StatutesListController.$inject = ['StatutesService', 'Authentication'];

  function StatutesListController(StatutesService, Authentication) {
    var vm = this;

    vm.permission = Authentication.user.roles.length;

    vm.statutes = StatutesService.query();
  }
})();
