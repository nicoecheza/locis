'use strict';

/**
 * Module dependencies
 */
var normativasPolicy = require('../policies/normativas.server.policy'),
  normativas = require('../controllers/normativas.server.controller');

module.exports = function(app) {
  // Normativas Routes
  app.route('/api/normativas').all(normativasPolicy.isAllowed)
    .get(normativas.list)
    .post(normativas.create);

  app.route('/api/normativas/:normativaId').all(normativasPolicy.isAllowed)
    .get(normativas.read)
    .put(normativas.update)
    .delete(normativas.delete);

  // Finish by binding the Normativa middleware
  app.param('normativaId', normativas.normativaByID);
};
