'use strict';

var STATUTES_STATUS = require('../../types').STATUTES_STATUS;

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Statute Schema
 */
var StatuteSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Por favor, asigne un nombre al estatuto',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  status: {
    type: 'string',
    enum: STATUTES_STATUS,
    default: STATUTES_STATUS[0],
    required: 'Por favor, asigne un estado al estatuto'
  }
});

mongoose.model('Statute', StatuteSchema);
