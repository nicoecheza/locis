(function () {
  'use strict';

  angular
    .module('statutes')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Statutes',
      state: 'statutes',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'statutes', {
      title: 'List Statutes',
      state: 'statutes.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'statutes', {
      title: 'Create Statute',
      state: 'statutes.create',
      roles: ['user']
    });
  }
})();
