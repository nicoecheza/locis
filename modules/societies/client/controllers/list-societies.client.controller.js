(function () {
  'use strict';

  angular
    .module('societies')
    .controller('SocietiesListController', SocietiesListController);

  SocietiesListController.$inject = ['SocietiesService'];

  function SocietiesListController(SocietiesService) {
    var vm = this;

    vm.societies = SocietiesService.query();
  }
})();
