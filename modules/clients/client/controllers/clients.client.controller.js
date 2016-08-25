(function () {
  'use strict';

  // Clients controller
  angular
    .module('clients')
    .controller('ClientsController', ClientsController);

  ClientsController.$inject = ['$scope', '$state', '$http', 'Authentication', 'clientResolve'];

  function ClientsController ($scope, $state, $http, Authentication, client) {
    var vm = this;

    vm.authentication = Authentication;
    vm.client = client;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.sendMail = sendMail;
    vm.permission = Authentication.user.roles.indexOf('admin') !== -1;

    // Remove existing Client
    function sendMail() {
      $http.post('/mail', { to: vm.client.email });
    }

    // Remove existing Client
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.client.$remove($state.go('clients.list'));
      }
    }

    // Save Client
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.clientForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.client._id) {
        vm.client.$update(successCallback, errorCallback);
      } else {
        vm.client.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('clients.view', {
          clientId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
