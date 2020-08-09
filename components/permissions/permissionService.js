const moment = require('moment');
const permissionDal = require('./permissionDAL');

/**
* @author M. Musyahid Abror
* Get all item
* @param {Object} query request (string)
* @api public
*/

exports.get = async (query) => {
  const getResult = {};
  getResult.data = await permissionDal.get(query);

  return getResult;
};

/**
* Save item
* @param {Object} context express request object
* @api public
*/
exports.save = async (context) => {
  const item = await permissionDal.save(context);
  return item;
};

/**
* Update item
* @param {Object} id express request id (string)
* @param {Object} object express request Object
* @api public
*/
exports.update = async (id, object) => {
  object.updated_at = moment().utcOffset('7').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
  const item = await permissionDal.update(id, object);
  const result = await permissionDal.findById(id);
  return result;
};

/**
* Get One item By Id
* @param {Object} id express request id(string)
* @api public
*/

exports.findById = async (id) => {
  const item = await permissionDal.findById(id);
  return item;
};

/**
* Delete item By Id
* @param {Object} id express request id (string)
* @param {Object} object express request object
* @api public
*/

exports.deleteById = async (id, object) => {
  const deleteAt = {
    deleted_at: moment().utcOffset('7').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'),
  };
  const result = await permissionDal.update(id, deleteAt);
  const res = await permissionDal.deleteById(id);
  return res;
};
