(function () {
  'use strict';

  // Regulations controller
  angular
    .module('regulations')
    .controller('RegulationsController', RegulationsController);

  RegulationsController.$inject = ['$scope', '$state', 'Authentication', 'regulationResolve'];

  function RegulationsController ($scope, $state, Authentication, regulation) {
    var vm = this;

    vm.authentication = Authentication;
    vm.regulation = regulation;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.permission = Authentication.user.roles.indexOf('admin') !== -1;

    // Remove existing Regulation
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.regulation.$remove($state.go('regulations.list'));
      }
    }

    // Save Regulation
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.regulationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.regulation._id) {
        vm.regulation.$update(successCallback, errorCallback);
      } else {
        vm.regulation.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('regulations.view', {
          regulationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
