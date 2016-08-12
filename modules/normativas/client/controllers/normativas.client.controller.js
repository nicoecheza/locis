(function () {
  'use strict';

  // Normativas controller
  angular
    .module('normativas')
    .controller('NormativasController', NormativasController);

  NormativasController.$inject = ['$scope', '$state', 'Authentication', 'normativaResolve'];

  function NormativasController ($scope, $state, Authentication, normativa) {
    var vm = this;

    vm.authentication = Authentication;
    vm.normativa = normativa;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Normativa
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.normativa.$remove($state.go('normativas.list'));
      }
    }

    // Save Normativa
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.normativaForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.normativa._id) {
        vm.normativa.$update(successCallback, errorCallback);
      } else {
        vm.normativa.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('normativas.view', {
          normativaId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
