(function () {
  'use strict';

  angular
    .module('societies')
    .controller('SocietiesListController', SocietiesListController);

  SocietiesListController.$inject = ['SocietiesService', 'Authentication'];

  function SocietiesListController(SocietiesService, Authentication) {
    var vm = this;

    vm.permission = Authentication.user.roles.indexOf('admin') !== -1;

    vm.societies = SocietiesService.query();
  }
})();
