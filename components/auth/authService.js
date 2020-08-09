/* eslint-disable no-underscore-dangle */

const validator = require('email-validator');
const User = require('../users/user');
const optimus = require('../../libraries/utils/optimus');
const oauth2 = require('../../libraries/utils/oauth2');
const AuthenticationError = require('../../libraries/errors/AuthenticationError');

/**
* @author Agung Mulyawan
* Check credentials & return access token
* @params Object Object with props email & password
* @return Object User & access token
*/
exports.login = async ({ email, password }) => {
  // CHECK USER LOGGED IN USING EMAIL OR NIK
  if (!validator.validate(email)) {
    // CHECK CREDENTIAL ON OPTIMUS
    let res = await optimus.login(email, password);

    // CRENDENTIAL MATCH = 200
    if (res.status === 200) {
      // GET DATA FROM OPTIMUS
      res = await optimus.find(email);
      const eldap = res.data.people[0];

      // GET DATA ON LOCAL
      let currentUser = await User.findByEmail(eldap.email);

      if (!currentUser) { // DATA NOT FOUND ON LOCAL
        // TODO lengkapi data yang disimpan ke user management
        // TODO set data role companion
        const data = {
          username: eldap.email,
          email: eldap.email,
          fullname: eldap.lastName,
          password,
          emailVerStatus: true,
          type: 'telkom',
          nik: eldap.userName,
        };
        currentUser = await User.save(data);
      } else { // DATA FOUND ON LOCAL
        // maka update password user di user management & oauth2 server
        // TODO update password user di user management & oauth2 server
      }

      // SYNC USER ON EXPRESS GATEWAY
      await User.syncUserOnExpressGateway({
        id: currentUser._id,
        email: currentUser.email,
        fullname: currentUser.fullname,
        username: currentUser.email,
        nik: currentUser.nik,
      });

      // SYNC CREDENTIAL ON EXPRESS GATEWAY
      await User.syncCredentialOnExpressGateway({
        username: currentUser.email,
        password,
      });

      // REQUEST TOKEN TO OAUTH2 SERVER
      const result = await oauth2.token(currentUser.email, password);
      return { ...result, user: currentUser.transform() };
    }

    // CRENDENTIAL NOT MATCH = 403
    if (res.status === 403) {
      throw new AuthenticationError('These credentials do not match our records.');
    }
  }

  // CHECK CREDENTIALS
  const currentUser = await User.attempt(email, password);

  // CREDENTIAL NOT MACTH
  if (!currentUser) {
    throw new AuthenticationError('These credentials do not match our records.');
  }

  // CREDENTIAL NOT ACTIVE
  if (currentUser.emailVerStatus === false) {
    throw new AuthenticationError('These credential is not active.');
  }

  // SYNC USER ON EXPRESS GATEWAY
  await User.syncUserOnExpressGateway({
    id: currentUser._id,
    email: currentUser.email,
    fullname: currentUser.fullname,
    username: currentUser.email,
    nik: currentUser.nik,
  });

  // SYNC CREDENTIAL ON EXPRESS GATEWAY
  await User.syncCredentialOnExpressGateway({
    username: currentUser.email,
    password,
  });

  // REQUEST TOKEN TO OAUTH2 SERVER
  const result = await oauth2.token(currentUser.email, password);
  return { ...result, user: currentUser.transform() };
};


/**
* Generate access token using refresh token
* @params String refreshToken
* @return String access token
*/
exports.generateRefreshToken = async (refreshToken) => {
  // REQUEST TOKEN TO OAUTH2 SERVER USING REFRESH TOKEN
  const result = await oauth2.refreshToken(refreshToken);
  return result;
};
