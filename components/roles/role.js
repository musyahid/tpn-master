const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const mongooseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    unique: true,
  },
  menus: [{
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      validate: {
        async validator(value) {
          const exists = await mongoose.model('Menu').count({ _id: value });
          return exists;
        },
        message: (props) => `${props.value} is not exits`,
      },
      ref: 'Menu',
    },
    childs: [{
      type: mongoose.Schema.Types.ObjectId,
      validate: {
        async validator(value) {
          const exists = await mongoose.model('Menu').count({ _id: value });
          return exists;
        },
        message: (props) => `${props.value} is not exits`,
      },
      ref: 'Menu',
    }],
  }, { _id: false }],
  permissions: [{
    type: String,
    validate: {
      async validator(value) {
        const exists = await this.model('Permission').count({ _id: value });
        return exists;
      },
      message: (props) => `${props.value} is not exits`,
    },
    ref: 'Permission',
  }],
  created_by: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  meta: mongoose.Schema.Types.Mixed,
}, { timestamps: true });
mongooseSchema.plugin(uniqueValidator, { message: 'Expected {PATH} to be unique.' });


module.exports = mongoose.model('Role', mongooseSchema);
