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
    required: 'Please fill Society name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Society', SocietySchema);
