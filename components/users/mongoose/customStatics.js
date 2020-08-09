const { pick } = require('lodash');
const expressGateway = require('../../../libraries/utils/expressGateway');

async function findByToken(value) {
  const item = await this.findOne(
    { resetPasswordToken: value, resetPasswordExpires: { $gt: Date.now() } },
  );
  return item;
}

async function findByEmail(value) {
  const item = await this.findOne({ email: value });
  return item;
}

async function findByNik(value) {
  const item = await this.findOne({ nik: value });
  return item;
}

async function findById(id) {
  const pathRole = {
    path: 'role',
    select: 'name',
    populate: [{ path: 'menu', select: ['name', 'level', 'fa', 'order'] },
      { path: 'permission', select: ['code', 'name', 'description', 'level_access'] }],
  };
  const pathMenu = { path: 'menu', select: ['name', 'level', 'fa', 'order'] };
  const pathPermission = { path: 'permission', select: ['code', 'name', 'description', 'level_access'] };
  const item = await this.findOne({ _id: id }).populate([pathRole, pathMenu, pathPermission]);
  return item;
}

async function updateProfile(id, item) {
  const result = await this.updateOne({ _id: id }, { $set: item });
  return result;
}

async function resetEmailToken(valEmail, valToken) {
  const item = await this.findOne(
    {
      email: valEmail,
      resetPasswordToken: valToken,
    },
  );
  return item;
}

async function findEmailToken(tokenVal, emailVal) {
  const item = await this.findOne({ email: emailVal, emailVerCode: tokenVal });
  return item;
}

/**
 * syncronize user to express gateway
 * @params Object User
 * @return Object User
 */
async function syncUserOnExpressGateway(user) {
  let expressGatewayUser = {};
  try {
    expressGatewayUser = await expressGateway.getUser(user.username);
    // TODO SYNCRONIZE DATA LOCAL TO EXPRESS GATEWAY
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        // TODO lengkapi data yang disimpan ke express gateway
        const data = pick(user, ['id', 'email', 'fullname', 'username', 'nik']);
        expressGatewayUser = await expressGateway.createUser(data);
      }
    }
  }
  return expressGatewayUser;
}


/**
 * syncronize credential for a user on express gateway
 * @params Object item
 * @return Object Credential
 */
async function syncCredentialOnExpressGateway(item) {
  let expressGatewayCredential = {};

  try {
    expressGatewayCredential = await expressGateway.getCredential(item.username);
    const basicAuth = expressGatewayCredential.credentials.find((o) => o.type === 'basic-auth');
    if (!basicAuth) {
      throw new Error();
    }

    // IF BASIC AUTH CREDENTIAL EXIST THEN DEACTIVATE IT!
    await expressGateway.deactivateCredential(basicAuth.id, 'basic-auth');

    // TODO SYNCRONIZE DATA LOCAL TO EXPRESS GATEWAY
  } catch (error) {
    // buat credential untuk user yang baru dibuat diatas
  }

  // RECREATE BASIC AUTH WITH GIVEN PASSWORD!
  // TO KEEP IT UP TO DATE
  const data = {
    consumerId: item.username,
    type: 'basic-auth',
    properties: {
      passwordKey: 'password',
      password: item.password,
    },
  };

  expressGatewayCredential = await expressGateway.createCredential(data);

  return expressGatewayCredential;
}

/**
 * Attempt credentials login
 * @param String email
 * @param String password
 * @return Boolean
 */
async function attempt(email, password) {
  let isEmailPasswordCorrect = false;
  try {
    const user = await this.findByEmail(email);
    if (user) {
      isEmailPasswordCorrect = await user.comparePassword(password);
      if (isEmailPasswordCorrect) {
        return user;
      }
    }
    return isEmailPasswordCorrect;
  } catch (error) {
    return isEmailPasswordCorrect;
  }
}

module.exports = {
  findByToken,
  findByEmail,
  findByNik,
  findById,
  updateProfile,
  resetEmailToken,
  findEmailToken,
  syncUserOnExpressGateway,
  syncCredentialOnExpressGateway,
  attempt,
};
