const axios = require('axios');
const config = require('config');

const optimus = {};
const endpoint = config.get('optimus.endpoint');
const user = config.get('optimus.user');
const secret = config.get('optimus.secret');

/**
 * Get Access Token
 * @return Json
 */
optimus.getAccessToken = async () => {
  const body = {
    name: user,
    password: secret,
  };
  const result = await axios.post(`${endpoint}/api/login`, body);
  return result.data;
};

/**
 * Check optimus eldap credentials
 * @param String username (NIK)
 * @param String password
 * @return Boolean
 */
optimus.login = async (username, password) => {
  const body = {
    username,
    password,
  };
  const result = await axios.post(`${endpoint}/api/ldap/login`, body);
  return result.data;
};

/**
 * Get user by nik / name
 * @param String query
 * @return Json
 */
optimus.find = async (query) => {
  const res = await optimus.getAccessToken();

  const option = {
    headers: {
      Authorization: `Bearer ${res.data.token}`,
    },
  };
  const body = {
    filter: query,
  };

  const result = await axios.post(`${endpoint}/api/people`, body, option);

  return result.data;
};

/**
 * Get a user by email
 * @param String email
 * @return Json
 */
optimus.findByEmail = async (email) => {
  const res = await optimus.getAccessToken();

  const option = {
    headers: {
      Authorization: `Bearer ${res.data.token}`,
    },
  };

  const result = await axios.get(`${endpoint}/api/peopleByEmail/${email}`, option);

  return result.data;
};


module.exports = optimus;
