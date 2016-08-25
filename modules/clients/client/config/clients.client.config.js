(function () {
  'use strict';

  angular
    .module('clients')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Clients',
      state: 'clients',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'clients', {
      title: 'List Clients',
      state: 'clients.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'clients', {
      title: 'Create Client',
      state: 'clients.create',
      roles: ['user']
    });
  }
})();
