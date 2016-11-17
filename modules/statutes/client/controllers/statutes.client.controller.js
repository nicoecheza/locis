(function () {
  'use strict';

  // Statutes controller
  angular
    .module('statutes')
    .controller('StatutesController', StatutesController);

  StatutesController.$inject = ['$scope', '$state', 'Authentication', 'statuteResolve', 'ClientsService', '$sce'];

  function StatutesController ($scope, $state, Authentication, statute, ClientsService, $sce) {
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
    vm.clients = ClientsService.query();

    setTimeout(function() {
      var selects = [].slice.call(document.querySelectorAll('select')).slice(1);
      selects.forEach(function(select) {
        select.value = vm.statute.society[select.name];
      });
    }, 1000);

    // Move this to an external module (this code is duplicated in regulations.controller)
    $scope.toTrustedHTML = function(html) {
      return $sce.trustAsHtml(html);
    }

    // Update status
    function updateStatus(status) {
      vm.statute.status = status;
      if (status === 'done') {
        var check = confirm('Se creará una Sociedad con los datos en este estatuto. Está seguro?');
        if (!check) return false;
        return vm.statute.$update(function(society) {
          $state.go('societies.view', {
            societyId: society._id
          });
        }, function(err) { console.log(err); });
      }
      vm.statute.$update();
    }

    // Remove existing Statute
    function remove() {
      if (confirm('Esta seguro que quiere eliminar el estatuto?')) {
        vm.statute.$remove($state.go('statutes.list'));
      }
    }

    function getSocietyFields() {
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
        vm.statute.society = getSocietyFields();
        vm.statute.$update(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('statutes.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
