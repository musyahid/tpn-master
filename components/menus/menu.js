/* eslint-disable func-names */
const mongoose = require('mongoose');
const permissionDAL = require('../permissions/permissionDAL');

const mongooseSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
  },
  description: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
  },
  icon: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
  },
  type: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    enum: ['parent', 'permission', 'direct'],
  },
  url: {
    type: String,
    trim: true,
    default: null,
  },
  permissionId: {
    type: String,
    required() { return this.type === 'permission'; },
    trim: true,
    minlength: 3,
    maxlength: 255,
    validate: {
      async validator(value) {
        const exists = await this.model('Permission').count({ _id: value });
        return exists;
      },
      message: (props) => `${props.value} is not exits`,
    },
  },
  deletedAt: {
    type: Date,
  },
  meta: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

mongooseSchema.pre('save', async function (next) {
  const item = this;
  if (item.type === 'permission') {
    const rest = await permissionDAL.findById(item.permissionId);
    item.url = rest.url;
    return next();
  }
  return next();
});

// Global Static function
Object.assign(mongooseSchema.statics, require('../../libraries/mongoose/statics'));

// Custom Static function
Object.assign(mongooseSchema.statics, require('./customStatics'));

module.exports = mongoose.model('Menu', mongooseSchema);
