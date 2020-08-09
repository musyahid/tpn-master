const authService = require('./authService');
const respond = require('../../libraries/utils/respond');

/**
 * Endpoint for User to Login and get access token
 * @params req express request
 * @params res express response
 * @return Json
 */
exports.login = async (req, res) => {
  const item = await authService.login(req.body);
  if (item) {
    return respond.resSuccessData(res, 'Credential match', item);
  }
  return respond.resUnauthorized(res, 'These credentials do not match our records.');
};

/**
 * Endpoint for request new access token via refresh token
 * @params req express request
 * @params res express response
 * @return Json
 */
exports.refToken = async (req, res) => {
  const { refreshToken } = req.body;
  const item = await authService.generateRefreshToken(refreshToken);
  return respond.resSuccessData(res, 'Success', item);
};
