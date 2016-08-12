'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Normativa = mongoose.model('Normativa'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Normativa
 */
exports.create = function(req, res) {
  var normativa = new Normativa(req.body);
  normativa.user = req.user;

  normativa.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(normativa);
    }
  });
};

/**
 * Show the current Normativa
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var normativa = req.normativa ? req.normativa.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  normativa.isCurrentUserOwner = req.user && normativa.user && normativa.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(normativa);
};

/**
 * Update a Normativa
 */
exports.update = function(req, res) {
  var normativa = req.normativa ;

  normativa = _.extend(normativa , req.body);

  normativa.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(normativa);
    }
  });
};

/**
 * Delete an Normativa
 */
exports.delete = function(req, res) {
  var normativa = req.normativa ;

  normativa.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(normativa);
    }
  });
};

/**
 * List of Normativas
 */
exports.list = function(req, res) { 
  Normativa.find().sort('-created').populate('user', 'displayName').exec(function(err, normativas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(normativas);
    }
  });
};

/**
 * Normativa middleware
 */
exports.normativaByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Normativa is invalid'
    });
  }

  Normativa.findById(id).populate('user', 'displayName').exec(function (err, normativa) {
    if (err) {
      return next(err);
    } else if (!normativa) {
      return res.status(404).send({
        message: 'No Normativa with that identifier has been found'
      });
    }
    req.normativa = normativa;
    next();
  });
};
