(function () {
  'use strict';

  angular
    .module('regulations')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Regulations',
      state: 'regulations',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'regulations', {
      title: 'List Regulations',
      state: 'regulations.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'regulations', {
      title: 'Create Regulation',
      state: 'regulations.create',
      roles: ['user']
    });
  }
})();
