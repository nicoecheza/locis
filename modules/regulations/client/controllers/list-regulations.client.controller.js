(function () {
  'use strict';

  angular
    .module('regulations')
    .controller('RegulationsListController', RegulationsListController);

  RegulationsListController.$inject = ['RegulationsService'];

  function RegulationsListController(RegulationsService) {
    var vm = this;

    vm.regulations = RegulationsService.query();
  }
})();
