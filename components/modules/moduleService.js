const moment = require('moment');
const bcrypt = require('bcrypt');
const moduleDAL = require('./moduleDAL');
const permissionDAL = require('../permissions/permissionDAL');

/**
* @author M. Musyahid Abror
* Get all item
* @param {Object} query request (string)
* @api public
*/

exports.get = async (query) => {
  const getResult = {};
  getResult.data = await moduleDAL.get(query);
  getResult.total = await moduleDAL.getTotal();
  getResult.filtered = await moduleDAL.getTotalFiltered(query);
  return getResult;
};

/**
* Save item
* @param {Object} context express request object
* @api public
*/
exports.save = async (context) => {
  const item = await moduleDAL.save(context);
  const result = await moduleDAL.findById(item._id);

  return result;
};

/**
* Update item
* @param {Object} id express request id (string)
* @param {Object} object express request Object
* @api public
*/
exports.update = async (id, object) => {
  object.updated_at = moment().utcOffset('7').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
  const res = await moduleDAL.update(id, object);
  const result = await moduleDAL.findById(id);
  return result;
};

/**
* Get One item By Id
* @param {Object} id express request id(string)
* @api public
*/
exports.findById = async (id) => {
  const item = await moduleDAL.findById(id);
  return item;
};
/**
* Delete item By Id
* @param {Object} id express request id (string)
* @param {Object} object express request object
* @api public
*/

exports.deleteById = async (id, object) => {
  item.deleted_at = moment().utcOffset('7').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
  const result = await moduleDAL.update(item);
  const res = await moduleDAL.deleteById(id);
  return res;
};
