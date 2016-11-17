'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Statute = mongoose.model('Statute'),
  Society = mongoose.model('Society'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  replacer = require('../types/replacer');

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
  var statute = req.statute;

  console.log(req.body.society)

  statute = _.extend(statute , req.body);

  if (statute.status === 'done') {

    var society = new Society({
      user: statute.user,
      client: statute.client,
      regulation: statute.regulation,
      society: statute.society,
      name: statute.name
    });

    society.save(function(err, society) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }

      statute.remove(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        res.jsonp(society);
      });

    });

  }

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
  Statute.find().sort('-created').populate(['user', 'client', 'regulation']).exec(function(err, statutes) {
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

  Statute.findById(id).populate(['user', 'client', 'regulation']).exec(function (err, statute) {
    if (err) {
      return next(err);
    } else if (!statute) {
      return res.status(404).send({
        message: 'No Statute with that identifier has been found'
      });
    }

    statute.regulation.template = parseTemplate(statute.regulation.template, statute.society);

    req.statute = statute;
    next();
  });
};

function parseTemplate(tmpl, society) {

  var init = tmpl.indexOf("{"),
      end = tmpl.indexOf("}");

  while (init >= 0 && end >= 0) {

    // Get interpolation
    var interpolation = tmpl.substring(init, end + 1),
        parsed = JSON.parse(interpolation);

    // Replace template interpolations with HTML
    tmpl = tmpl.replace(interpolation, replacer(parsed, society));

    // Update init & end positions looking for next interpolation
    init = tmpl.indexOf("{");
    end  = tmpl.indexOf("}");

  }

  return tmpl;

}
