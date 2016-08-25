'use strict';

/**
 * Module dependencies
 */
var societiesPolicy = require('../policies/societies.server.policy'),
  societies = require('../controllers/societies.server.controller');

module.exports = function(app) {
  // Societies Routes
  app.route('/api/societies').all(societiesPolicy.isAllowed)
    .get(societies.list)
    .post(societies.create);

  app.route('/api/societies/:societyId').all(societiesPolicy.isAllowed)
    .get(societies.read)
    .put(societies.update)
    .delete(societies.delete);

  // Finish by binding the Society middleware
  app.param('societyId', societies.societyByID);
};
