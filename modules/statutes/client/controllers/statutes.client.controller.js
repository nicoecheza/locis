(function () {
  'use strict';

  // Statutes controller
  angular
    .module('statutes')
    .controller('StatutesController', StatutesController);

  StatutesController.$inject = ['$scope', '$state', 'Authentication', 'statuteResolve'];

  function StatutesController ($scope, $state, Authentication, statute) {
    var vm = this;

    vm.STATUTES_STATUS = ['ready', 'sent', 'reviewing', 'rejected', 'done'];

    vm.authentication = Authentication;
    vm.statute = statute;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.updateStatus = updateStatus;
    vm.permission = Authentication.user.roles.length;

    // Update status
    function updateStatus(status) {
      vm.statute.status = status;
      if (status === 'done') {
        var check = confirm('Se creará una Sociedad con los datos en este estatuto. Está seguro?');
        if (!check) return false;
      }
      vm.statute.$update();
    }

    // Remove existing Statute
    function remove() {
      if (confirm('Esta seguro que quiere eliminar el estatuto?')) {
        vm.statute.$remove($state.go('statutes.list'));
      }
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
