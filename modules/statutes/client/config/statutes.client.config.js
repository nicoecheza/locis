(function () {
  'use strict';

  angular
    .module('statutes')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Estatutos',
      state: 'statutes',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'statutes', {
      title: 'Listar Estatutos',
      state: 'statutes.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'statutes', {
      title: 'Crear Estatutos',
      state: 'statutes.create',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'statutes', {
      title: 'Listar Regulaciones',
      state: 'regulations.list',
      roles: ['user']
    });

  }
})();
