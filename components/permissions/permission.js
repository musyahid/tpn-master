const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const mongooseSchema = new mongoose.Schema({
  _id: {
    type: String,
    require: true,
    trim: true,
    minlength: 3,
    maxlength: 255,

  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  isMenu: {
    type: Boolean,
  },
  url: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    trim: true,
    unique: true,
  },
  editable: {
    type: Boolean,
  },
  meta: mongoose.Schema.Types.Mixed,
}, { timestamps: true });
mongooseSchema.plugin(uniqueValidator, { message: 'Expected {PATH} to be unique.' });

module.exports = mongoose.model('Permission', mongooseSchema);
