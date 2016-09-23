'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var validateCuil = function(cuil) {
    var re = /^[0-9]{10,11}$/;
    return re.test(cuil)
};

/**
 * Client Schema
 */
var ClientSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Client name',
    trim: true
  },
  business_name: {
    type: String,
    default: '',
    required: 'Please fill Client business name',
    trim: true
  },
  cuil: {
    type: Number,
    default: '',
    required: 'Please fill Client cuil',
    trim: true,
    validate: [validateCuil, 'Por favor ingrese un numero de cuil valido'],
        match: [/^[0-9]{10,11}$/, 'Por favor ingrese un numero de cuil valido']
  },
  address: {
    type: String,
    default: '',
    required: 'Please fill Client address',
    trim: true
  },
  email: {
    type: String,
    default: '',
    required: 'Please fill Client email',
    trim: true
  },
  phone: {
    type: Number,
    default: '',
    required: 'Please fill Client Phone number',
    trim: true
  },
  cellphone: {
    type: Number,
    default: '',
    required: 'Please fill Client Cellphone number',
    trim: true
  },
  fax: {
    type: Number,
    default: '',
    required: 'Please fill Client Fax number',
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

mongoose.model('Client', ClientSchema);
