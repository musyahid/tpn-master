const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const organizationStructureSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  level: {
    type: String,
    trim: true,
    required: true,
  },
  code: {
    type: String,
    trim: true,
    required: false,
  },
  parent: {
    type: String,
    trim: true,
    required: false,
  },
});

organizationStructureSchema.methods.hasNext = function () {
  return this.model('OrganizationStructure').count({ parent: this._id }) > 0;
};
organizationStructureSchema.plugin(uniqueValidator, { message: 'Expected {PATH} to be unique.' });

const OrganizationStructure = mongoose.model('OrganizationStructure', organizationStructureSchema);
module.exports = OrganizationStructure;
