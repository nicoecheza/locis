'use strict';

/**
 * Module dependencies
 */
var statutesPolicy = require('../policies/statutes.server.policy'),
  statutes = require('../controllers/statutes.server.controller');

module.exports = function(app) {
  // Statutes Routes
  app.route('/api/statutes').all(statutesPolicy.isAllowed)
    .get(statutes.list)
    .post(statutes.create);

  app.route('/api/statutes/:statuteId').all(statutesPolicy.isAllowed)
    .get(statutes.read)
    .put(statutes.update)
    .delete(statutes.delete);

  // Finish by binding the Statute middleware
  app.param('statuteId', statutes.statuteByID);
};
