'use strict';

/**
 * Module dependencies
 */
var regulationsPolicy = require('../policies/regulations.server.policy'),
  regulations = require('../controllers/regulations.server.controller');

module.exports = function(app) {
  // Regulations Routes
  app.route('/api/regulations').all(regulationsPolicy.isAllowed)
    .get(regulations.list)
    .post(regulations.create);

  app.route('/api/regulations/:regulationId').all(regulationsPolicy.isAllowed)
    .get(regulations.read)
    .put(regulations.update)
    .delete(regulations.delete);

  // Finish by binding the Regulation middleware
  app.param('regulationId', regulations.regulationByID);
};
