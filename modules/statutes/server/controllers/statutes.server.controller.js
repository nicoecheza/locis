'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Statute = mongoose.model('Statute'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Statute
 */
exports.create = function(req, res) {
  var statute = new Statute(req.body);
  statute.user = req.user;

  statute.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(statute);
    }
  });
};

/**
 * Show the current Statute
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var statute = req.statute ? req.statute.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  statute.isCurrentUserOwner = req.user && statute.user && statute.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(statute);
};

/**
 * Update a Statute
 */
exports.update = function(req, res) {
  var statute = req.statute ;

  statute = _.extend(statute , req.body);

  statute.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(statute);
    }
  });
};

/**
 * Delete an Statute
 */
exports.delete = function(req, res) {
  var statute = req.statute ;

  statute.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(statute);
    }
  });
};

/**
 * List of Statutes
 */
exports.list = function(req, res) { 
  Statute.find().sort('-created').populate('user', 'displayName').exec(function(err, statutes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(statutes);
    }
  });
};

/**
 * Statute middleware
 */
exports.statuteByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Statute is invalid'
    });
  }

  Statute.findById(id).populate('user', 'displayName').exec(function (err, statute) {
    if (err) {
      return next(err);
    } else if (!statute) {
      return res.status(404).send({
        message: 'No Statute with that identifier has been found'
      });
    }
    req.statute = statute;
    next();
  });
};
