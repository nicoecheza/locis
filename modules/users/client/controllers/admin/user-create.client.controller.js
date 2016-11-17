(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserCreateController', UserCreateController);

  UserCreateController.$inject = ['$scope', '$state', 'Authentication', 'userResolve'];

  function UserCreateController($scope, $state, Authentication, user) {
    var vm = this;

    vm.authentication = Authentication;
    vm.user = user;
    vm.update = create;

    function create(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');
        return false;
      }

      var user = vm.user;

      user.$save(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        vm.error = errorResponse.data.message;
      });
    }
  }
}());
