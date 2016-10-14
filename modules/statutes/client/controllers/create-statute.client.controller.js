(function () {
  'use strict';

  // Statutes controller
  angular
    .module('statutes')
    .controller('CreateStatuteController', CreateStatuteController);

  CreateStatuteController.$inject = ['$scope', '$state', 'Authentication', 'statuteResolve', 'ClientsService', 'RegulationsService'];

  function CreateStatuteController ($scope, $state, Authentication, statute, ClientsService, RegulationsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.save = save;
    vm.updateStatus = updateStatus;
    vm.permission = Authentication.user.roles.length;
    vm.regulationDisplay = regulationDisplay;

    vm.clients = ClientsService.query();
    vm.regulations = RegulationsService.query();

    // Update status
    function updateStatus(status) {
      vm.statute.status = status;
      vm.statute.$update();
    }

    function regulationDisplay(id) {
      vm.regulation = RegulationsService.get({ id: id });
      console.log(vm.regulation);
    }

    // Save Statute
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.statuteForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.statute._id) {
        vm.statute.$update(successCallback, errorCallback);
      } else {
        vm.statute.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('statutes.view', {
          statuteId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
