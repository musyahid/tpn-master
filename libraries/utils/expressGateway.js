const axios = require('axios');
const config = require('config');

const apiGateway = {};
const endpoint = config.get('api_gateway.adminEndpoint');

/**
 * Create user in express gateway
 * @params Json (fullname, username, email)
 * @return Json
 */
apiGateway.createUser = async (data) => {
  const bodies = {
    username: data.username,
    fullname: data.fullname,
    email: data.email,
    id: data.id,
    nik: data.nik,
  };
  const result = await axios.post(`${endpoint}/users`, bodies);
  return result.data;
};

/**
 * Get user by id / username
 * @params String idOrUsername
 * @return Json
 */
apiGateway.getUser = async (idOrUsername) => {
  const result = await axios.get(`${endpoint}/users/${idOrUsername}`);
  return result.data;
};

/**
 * Delete user by id / username
 * @params String idOrUsername
 * @return Json
 */
apiGateway.deleteUser = async (idOrUsername) => {
  let result = {};
  try {
    result = await axios.delete(`${endpoint}/users/${idOrUsername}`);
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
  return result.data;
};

/**
 * Create credential for a user
 * @params Json (consumerId, type)
 * @return Json
 */
apiGateway.createCredential = async (data) => {
  const bodies = {
    consumerId: data.consumerId,
    type: data.type,
    credential: data.properties,
  };
  const result = await axios.post(`${endpoint}/credentials`, bodies);
  return result.data;
};

/**
 * Get consumer credential by consumerId
 * @params String (Username, UserId or AppId)
 * @return Json
 */
apiGateway.getCredential = async (idOrUsername) => {
  const result = await axios.get(`${endpoint}/credentials/${idOrUsername}`);
  return result.data;
};

/**
 * Deactivate credential by consumerId
 * @params String (Username, UserId or AppId)
 * @params String type (basic-auth, oauth2, key-auth)
 * @return Json
 */
apiGateway.deactivateCredential = async (idOrUsername, type) => {
  const result = await axios.put(`${endpoint}/credentials/${type}/${idOrUsername}/status`, { status: false });
  return result.data;
};

module.exports = apiGateway;
