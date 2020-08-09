const axios = require('axios');
const config = require('config');
const AuthenticationError = require('../errors/AuthenticationError');

const oauth2 = {};
const endpoint = config.get('api_gateway.endpoint');
const token = Buffer
  .from(`${config.get('api_gateway.client_id')}:${config.get('api_gateway.secret')}`)
  .toString('base64');

/**
 * Request an access token with resource owner password credential grant
 * @params String username
 * @params String password
 */
oauth2.token = async (username, password) => {
  const bodies = {
    username,
    password,
    grant_type: 'password',
    // TODO scopes belum terdefinisi
  };

  const option = {
    headers: {
      Authorization: `Basic ${token}`,
    },
  };

  const result = await axios.post(`${endpoint}/oauth2/token`, bodies, option);
  return result.data;
};

/**
 * Request an access token using refresh token
 * @params String refreshToken
 */
oauth2.refreshToken = async (refreshToken) => {
  const bodies = {
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  };

  const option = {
    headers: {
      Authorization: `Basic ${token}`,
    },
  };

  let result = {};

  try {
    result = await axios.post(`${endpoint}/oauth2/token`, bodies, option);
  } catch (error) {
    if (error.response.status === 403) {
      throw new AuthenticationError('Invalid Refresh Token');
    }
  }

  return result.data;
};

module.exports = oauth2;
