'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Society = mongoose.model('Society'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Society
 */
exports.create = function(req, res) {
  var society = new Society(req.body);
  society.user = req.user;

  society.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(society);
    }
  });
};

/**
 * Show the current Society
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var society = req.society ? req.society.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  society.isCurrentUserOwner = req.user && society.user && society.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(society);
};

/**
 * Update a Society
 */
exports.update = function(req, res) {
  var society = req.society ;

  society = _.extend(society , req.body);

  society.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(society);
    }
  });
};

/**
 * Delete an Society
 */
exports.delete = function(req, res) {
  var society = req.society ;

  society.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(society);
    }
  });
};

/**
 * List of Societies
 */
exports.list = function(req, res) { 
  Society.find().sort('-created').populate('user', 'displayName').exec(function(err, societies) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(societies);
    }
  });
};

/**
 * Society middleware
 */
exports.societyByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Society is invalid'
    });
  }

  Society.findById(id).populate('user', 'displayName').exec(function (err, society) {
    if (err) {
      return next(err);
    } else if (!society) {
      return res.status(404).send({
        message: 'No Society with that identifier has been found'
      });
    }
    req.society = society;
    next();
  });
};
