(function () {
  'use strict';

  // Societies controller
  angular
    .module('societies')
    .controller('SocietiesController', SocietiesController);

  SocietiesController.$inject = ['$scope', '$state', 'Authentication', 'societyResolve'];

  function SocietiesController ($scope, $state, Authentication, society) {
    var vm = this;

    vm.authentication = Authentication;
    vm.society = society;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Society
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.society.$remove($state.go('societies.list'));
      }
    }

    // Save Society
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.societyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.society._id) {
        vm.society.$update(successCallback, errorCallback);
      } else {
        vm.society.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('societies.view', {
          societyId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();