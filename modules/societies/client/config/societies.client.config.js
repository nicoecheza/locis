(function () {
  'use strict';

  angular
    .module('societies')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Societies',
      state: 'societies',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'societies', {
      title: 'List Societies',
      state: 'societies.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'societies', {
      title: 'Create Society',
      state: 'societies.create',
      roles: ['user']
    });
  }
})();
