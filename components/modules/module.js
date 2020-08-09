const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const moduleSchema = new mongoose.Schema({
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
  },
  description: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  editable: {
    type: Boolean,
    required: true,
  },
  permissionId: [{
    type: String,
    minlength: 3,
    maxlength: 255,
    ref: 'Permission',
  }],

  meta: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

moduleSchema.plugin(uniqueValidator, { message: 'Expected {PATH} to be unique.' });

exports.Module = mongoose.model('Module', moduleSchema);
