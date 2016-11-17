(function () {
  'use strict';

  // Statutes controller
  angular
    .module('statutes')
    .controller('CreateStatuteController', CreateStatuteController);

  CreateStatuteController.$inject = ['$scope', '$state', 'Authentication',
                                     'statuteResolve', 'ClientsService',
                                     'RegulationsService', '$sce'];

  function CreateStatuteController (
      $scope, $state, Authentication, statute, ClientsService, RegulationsService,
      $sce) {
    var vm = this;

    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.save = save;
    vm.updateStatus = updateStatus;
    vm.permission = Authentication.user.roles.length;
    vm.regulationDisplay = regulationDisplay;
    vm.statute = statute;

    vm.clients = ClientsService.query();
    vm.regulations = RegulationsService.query();
    // vm.regulation = null;

    // Move this to an external module (this code is duplicated in regulations.controller)
    $scope.toTrustedHTML = function(html) {
      return $sce.trustAsHtml(html);
    }

    // Update status
    function updateStatus(status) {
      vm.statute.status = status;
      vm.statute.$update();
    }

    function regulationDisplay(id) {
      vm.regulation = RegulationsService.get({ regulationId: id });
      vm.statute.regulation = id;
    }

    function getSocietyFields(regulation) {
      var fields = document.querySelectorAll('.regulation input, .regulation select');
      var result = {};
      fields.forEach(function(field) {
        result[field.name] = field.value;
      });
      return result;
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
        vm.statute.society = getSocietyFields(vm.regulation);
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
