/* eslint-disable no-underscore-dangle */
const moment = require('moment');
const axios = require('axios');
const config = require('config');
const pug = require('pug');
const crypto = require('crypto');
const util = require('util');
const fileUpload = require('../../libraries/utils/fileUpload');
const optimus = require('../../libraries/utils/optimus');
const expressGateway = require('../../libraries/utils/expressGateway');
const User = require('./user');
const UserActivationNotification = require('../../notifications/UserActivationNotification');

/**
* @author Ronaldo Triandes
* Get all item
* @param {Object} query request (string)
* @api public
*/
exports.get = async (query) => {
  const getResult = {};
  getResult.data = await User.get(query);
  getResult.total = await User.getTotal();
  getResult.filtered = await User.getTotalFiltered(query);
  return getResult;
};

/**
* Create a User
* @param {Object} context express request object
* @api public
*/
exports.save = async (context) => {
  // create user in user management
  const currentUser = await User.store(context);

  // SYNC USER ON EXPRESS GATEWAY
  await User.syncUserOnExpressGateway({
    id: currentUser._id,
    email: currentUser.email,
    fullname: currentUser.fullname,
    username: currentUser.email,
  });

  // SYNC CREDENTIAL ON EXPRESS GATEWAY
  await User.syncCredentialOnExpressGateway({
    username: currentUser.email,
    password: context.password,
  });

  return currentUser;
};

/**
* @author Ronaldo Triandes
* reset password
* @param String token
* @param String email
* @param String password
* @api public
*/
exports.resetPassword = async (token, email, password) => {
  const item = await User.findByToken(token);
  if (!item) {
    const e = new Error('Item not found!');
    e.name = 'Not Found';
    e.details = 'Token expired or not match our data';
    throw e;
  }
  const resetEmailToken = await User.resetEmailToken(email, token);
  if (!resetEmailToken) {
    const e = new Error('Item not found!');
    e.name = 'Not Found';
    e.details = 'These email not match in our data';
    throw e;
  }
  const updateresetTokenPassword = {
    resetPasswordToken: undefined,
    resetPasswordExpires: undefined,
    password,
  };

  // SYNC CREDENTIAL ON EXPRESS GATEWAY
  await User.syncCredentialOnExpressGateway({
    username: email,
    password,
  });

  await User.update(item._id, updateresetTokenPassword);

  const template = await pug.renderFile('./template/user-reset-password-success.jade', {
    fullname: resetEmailToken.fullname,
    link: `${config.get('app.url')}/login`,
  });
  // reqbody for service notifications
  const body = {
    notification: [
      {
        driver: 'email',
        content: template,
        recipient: {
          name: resetEmailToken.fullname,
          email: resetEmailToken.email,
          subject: 'Change Password Success',
        },
      },
    ],
  };
  // send notifcations with service notifications
  await axios.post(config.get('app.notif'), body);
  const result = await User.findById(resetEmailToken._id);
  return result;
};

/**
* forgot password
* @author Ronaldo Triandes
* @param {Object} context express request object
* @api public
*/
exports.forgotPassword = async (context) => {
  const item = await User.findByEmail(context.email);
  if (!item) {
    const e = new Error(`Item with email:${context.email}, not found!`);
    e.name = 'Invalid Request';
    e.details = {
      key: 'email',
      message: `email:${context.email},Not Found!`,
    };
    throw e;
  }
  // generate token to email
  const updateToken = {
    resetPasswordToken: crypto.randomBytes(20).toString('hex'),
    resetPasswordExpires: Date.now() + 3600000,
  };
  // update token with filter id and updateToken
  await User.update(item._id, updateToken);
  // convert file pug(jade) to html
  const template = await pug.renderFile('./template/user-forgot-password.jade', {
    fullname: item.fullname,
    link: `${config.get('app.url')}/reset-password/${updateToken.resetPasswordToken}?email=${item.email}`,
  });
  // reqbody for service notifications
  const body = {
    notification: [
      {
        driver: 'email',
        content: template,
        recipient: {
          name: item.fullname,
          email: item.email,
          subject: 'Reset Password',
        },
      },
    ],
  };
  // send notifcations with service notifications
  const result = await axios.post(config.get('app.notif'), body);
  return result;
};


/**
* forgot password
* @author M. Musyahid Abror
* @param {Object} context express request object
* @api public
*/
exports.activationUser = async (context) => {
  const { token } = context;
  const { email } = context;
  const findEmailToken = await User.findEmailToken(token, email);
  if (!findEmailToken) {
    const e = new Error(`Item with email:${context.email}, not found!`);
    e.name = 'Not Found';
    e.details = 'Failed to activate user';
    throw e;
  }
  if (findEmailToken.emailVerStatus === true) {
    findEmailToken.status = true;
    return findEmailToken;
  }
  await User.update(findEmailToken._id, { emailVerStatus: true });
  return findEmailToken;
};


/**
* Change password
* @author Ronaldo Triandes
* @param {Object} context express request object
* @param {Object} decodeJwt express request object jwt decode
* @api public
*/
// eslint-disable-next-line no-shadow
exports.changePassword = async (decodeJwt, context) => {
  const changePassword = {
    password: context.password,
  };

  await User.update(decodeJwt._id, changePassword);
  const template = await pug.renderFile('./template/user-reset-password-success.jade', {
    fullname: decodeJwt.fullname,
    link: `${config.get('app.url')}/login`,
  });
  // reqbody for service notifications
  const body = {
    notification: [
      {
        driver: 'email',
        content: template,
        recipient: {
          name: decodeJwt.fullname,
          email: decodeJwt.email,
          subject: 'Reset Password Success',
        },
      },
    ],
  };
  // send notifcations with service notifications
  const result = await axios.post(config.get('app.notif'), body);
  return result;
};
/**
* Update item
* @param {Object} id express request id (string)
* @param {Object} object express request Object
* @api public
*/
exports.update = async (id, object) => {
  // eslint-disable-next-line no-param-reassign
  object.updatedAt = moment().utcOffset('7').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
  await User.update(id, object);
  const result = await User.findById(id);
  return result;
};

/**
* Upload Avatar
* @author Ronaldo Triandes
* @param {Object} object express request object
* @param {Object} id express request id
* @api public
*/
exports.uploadAva = async (id, object) => {
  if (!object || object.length > 1) {
    const e = new Error('No files were uploaded');
    e.name = 'Invalid Request';
    e.details = {
      key: 'Image',
      message: 'No files were uploaded or Files Multi can\'t Uploaded',
    };
    throw e;
  }
  const minioSizePath = {};
  minioSizePath.small = {
    height: 40,
    width: 40,
    path: util.format(config.get('minio.avapath'), id, 'small'),
  };
  minioSizePath.medium = {
    height: 80,
    width: 80,
    path: util.format(config.get('minio.avapath'), id, 'medium'),
  };
  minioSizePath.normal = {
    path: util.format(config.get('minio.avapath'), id, 'normal'),
  };
  const item = await fileUpload.uploadMinioImage(object, minioSizePath);
  const updateAva = {
    avatar: item.filename,
  };
  await User.update(id, updateAva);
  return item;
};
/**
* Get One item By Id
* @param {Object} id express request id(string)
* @api public
*/
exports.findById = async (id) => {
  const item = await User.findById(id);
  return item;
};
/**
* Delete User By Id
* @param {Object} id express request id (string)
* @param {Object} object express request object
* @api public
*/
exports.deleteById = async (id) => {
  const currentUser = await User.deleteById(id);
  await expressGateway.deleteUser(currentUser.email);
  return currentUser;
};

/**
 * Register a user
 * @params Object context
 * @return Object
 */
exports.register = async (context) => {
  // CHECK GIVEN EMAIL ON OPTIMUS
  const res = await optimus.findByEmail(context.email);

  // THROW ERROR IF GIVEN EMAIL ALREADY ON OPTIMUS
  if (res.status === 200) {
    throw new Error(`You can log in directly using ${context.email} with your eldap password`);
  }

  // create user in user management
  const currentUser = await User.store(context);

  await new UserActivationNotification(currentUser).send();

  // SYNC USER ON EXPRESS GATEWAY
  await User.syncUserOnExpressGateway({
    id: currentUser._id,
    email: currentUser.email,
    fullname: currentUser.fullname,
    username: currentUser.email,
  });

  // SYNC CREDENTIAL ON EXPRESS GATEWAY
  await User.syncCredentialOnExpressGateway({
    username: currentUser.email,
    password: context.password,
  });

  return currentUser;
};

/**
* Update item
* @param {Object} id express request id (string)
* @param {Object} object express request Object
* @api public
*/
exports.updateProfile = async (id, object) => {
  object.updatedAt = moment().utcOffset('7').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
  await User.updateProfile(id, object);
  const result = await User.findById(id);
  return result;
};
