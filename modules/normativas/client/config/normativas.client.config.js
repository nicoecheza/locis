(function () {
  'use strict';

  angular
    .module('normativas')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Normativas',
      state: 'normativas',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'normativas', {
      title: 'List Normativas',
      state: 'normativas.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'normativas', {
      title: 'Create Normativa',
      state: 'normativas.create',
      roles: ['user']
    });
  }
})();
