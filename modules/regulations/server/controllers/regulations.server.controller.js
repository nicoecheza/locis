'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Regulation = mongoose.model('Regulation'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Regulation
 */
exports.create = function(req, res) {
  var regulation = new Regulation(req.body);
  regulation.user = req.user;

  regulation.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(regulation);
    }
  });
};

/**
 * Show the current Regulation
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var regulation = req.regulation ? req.regulation.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  regulation.isCurrentUserOwner = req.user && regulation.user && regulation.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(regulation);
};

/**
 * Update a Regulation
 */
exports.update = function(req, res) {
  var regulation = req.regulation ;

  regulation = _.extend(regulation , req.body);

  regulation.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(regulation);
    }
  });
};

/**
 * Delete an Regulation
 */
exports.delete = function(req, res) {
  var regulation = req.regulation ;

  regulation.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(regulation);
    }
  });
};

/**
 * List of Regulations
 */
exports.list = function(req, res) { 
  Regulation.find().sort('-created').populate('user', 'displayName').exec(function(err, regulations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(regulations);
    }
  });
};

/**
 * Regulation middleware
 */
exports.regulationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Regulation is invalid'
    });
  }

  Regulation.findById(id).populate('user', 'displayName').exec(function (err, regulation) {
    if (err) {
      return next(err);
    } else if (!regulation) {
      return res.status(404).send({
        message: 'No Regulation with that identifier has been found'
      });
    }
    req.regulation = regulation;
    next();
  });
};
