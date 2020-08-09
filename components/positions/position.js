const mongoose = require('mongoose');

const mongooseSchema = new mongoose.Schema({
  position_id: {
    type: Number, 
    required: true, 
    minlength: 3, 
    maxlength: 255,
  },
  organization_structure_id: {
    type: String, 
    required: true, 
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
  band: {
    type: String, 
    required: true, 
    minlength: 3, 
    maxlength: 255,
  },
  position_code: {
    type: String, 
    required: true, 
    minlength: 3, 
    maxlength: 255,
  },
  meta: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

module.exports = mongoose.model('Position', mongooseSchema);
