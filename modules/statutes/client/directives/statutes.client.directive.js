(function () {
  'use strict';

  angular
    .module('statutes')
    .directive('status', status);

  function status() {

    var STATUTES_STATUS = ['ready', 'sent', 'reviewing', 'rejected', 'done'];

    return {
      // require: 'ngModel',
      restrict: 'E',
      link: link
    };

    function link(scope, element, attrs, modelCtrl) {

      var status = scope.statute.status;

      switch (status) {

        case 'ready':
          return element.addClass("status status-ready");

        case 'sent':
          return element.addClass("status status-sent");

        case 'reviewing':
          return element.addClass("status status-reviewing");

        case 'rejected':
          return element.addClass("status status-rejected");

        case 'done':
          return element.addClass("status status-done");

        default:
          return element.addClass("status status-ready");

      }
    }
  }
}());
