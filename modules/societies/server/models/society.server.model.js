'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Society Schema
 */
var SocietySchema = new Schema({
  name: {
    type: String,
    default: '',
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
  client: {
    type: Schema.ObjectId,
    ref: 'Client'
  },
  regulation: {
    type: Schema.ObjectId,
    ref: 'Regulation'
  },
  society: {
    type: Object,
    default: {},
    trim: true
  }
});

mongoose.model('Society', SocietySchema);
