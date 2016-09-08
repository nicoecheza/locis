(function () {
  'use strict';

  angular
    .module('statutes')
    .directive('statuses', statuses);

  function statuses() {

    return {
      // require: 'ngModel',
      restrict: 'E',
      // link: link,
      templateUrl: '/modules/statutes/client/views/statuses.client.directive.html'
    };

    function link(scope, element, attrs, modelCtrl) {

    }
  }
}());
