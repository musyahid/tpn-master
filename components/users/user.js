/* eslint-disable consistent-return */
/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');
const randomstring = require('randomstring');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  nik: {
    type: String,
    minlength: 5,
    maxlength: 255,
    trim: true,
    default: null,
    validate: {
      async validator(value) {
        if (value === null) { return true; }
        const exists = await this.model('User').countDocuments({ nik: value });
        return !exists;
      },
      message: (props) => `${props.value} is already exits`,
    },

  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    validate: {
      async validator(value) {
        const exists = await this.model('Role').countDocuments({ _id: value });
        return exists;
      },
      message: (props) => `${props.value} is not exits`,
    },
    ref: 'Role',
  },
  permission: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
  menu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }],
  email: {
    type: String,
    unique: true,
    minlength: 3,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    trim: true,
  },
  type: {
    type: String,
    enum: ['telkom', 'partner'],
  },
  emailVerCode: {
    type: String,
    minlength: 3,
    maxlength: 255,
    default: randomstring.generate(),
  },
  emailVerStatus: {
    type: Boolean,
    default: false,
  },
  jobPosition: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
  },
  phoneNumber: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    validate: {
      async validator(value) {
        if (value === null) { return true; }
        const exists = await this.model('User').countDocuments({ phoneNumber: value });
        return !exists;
      },
      message: () => 'phone number is already exists',
    },
  },
  country: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
  },
  avatar: {
    type: String,
    minlength: 3,
    trim: true,
  },
  deletedAt: {
    type: Date,
  },
  aktivasiToken: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  meta: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

userSchema.plugin(uniqueValidator, { message: '{PATH} is already exists.' });

// eslint-disable-next-line func-names
userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (e, hash) => {
      if (e) return next(e);
      user.password = hash;
      next();
    });
  });
});

// update password
userSchema.pre('updateOne', async function (next) {
  const user = this.getUpdate().$set.password;
  if (!user) {
    return next();
  }
  const hash = await bcrypt.hashSync(user, 10);
  this.getUpdate().$set.password = hash;
  return next();
});

// Global Static function
Object.assign(userSchema.statics, require('../../libraries/mongoose/statics'));

// Custom Static function
Object.assign(userSchema.statics, require('./mongoose/customStatics'));

// Custom Method function
Object.assign(userSchema.methods, require('./mongoose/customMethods'));

const User = mongoose.model('User', userSchema);
module.exports = User;
