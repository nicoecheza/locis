(function () {
  'use strict';

  angular
    .module('normativas')
    .controller('NormativasListController', NormativasListController);

  NormativasListController.$inject = ['NormativasService'];

  function NormativasListController(NormativasService) {
    var vm = this;

    vm.normativas = NormativasService.query();
  }
})();
