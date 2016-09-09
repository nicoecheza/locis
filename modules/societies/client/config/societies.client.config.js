(function () {
  'use strict';

  angular
    .module('societies')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Sociedades',
      state: 'societies',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'societies', {
      title: 'Listar Sociedades',
      state: 'societies.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'societies', {
      title: 'Crear Sociedades',
      state: 'societies.create',
      roles: ['admin']
    });
  }
})();
