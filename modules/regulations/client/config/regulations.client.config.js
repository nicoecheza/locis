(function () {
  'use strict';

  angular
    .module('regulations')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Regulaciones',
      state: 'regulations',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'regulations', {
      title: 'Crear Regulaciones',
      state: 'regulations.create',
      roles: ['superadmin']
    });
  }
})();
