'use strict';

var mailer = require('../controllers/mailer.server.controller');

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  app.route('/mail').post(mailer.sendMail);

  // Define application route
  app.route('/*').get(core.renderIndex);
};
