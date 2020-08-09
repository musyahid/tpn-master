const jwt = require('jsonwebtoken');
const config = require('config');
const respond = require('../libraries/utils/respond');

function auth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return respond.resUnauthorized(res, 'Access denied, No Token Provided');
  }
  try {
    const decoded = jwt.verify(token, config.get('jwt.secret'));
    res.locals.decode = decoded;
    next();
  } catch (e) {
    return respond.resBadRequest(res, 'Invalid Token');
  }
}

module.exports = auth;
