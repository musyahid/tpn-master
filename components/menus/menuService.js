const moment = require('moment');
const Menu = require('./menu');


/**
* @author Ronaldo Triandes
* Get all item
* @param {Object} query request (string)
* @api public
*/

exports.get = async (query) => {
  const getResult = {};
  getResult.data = await Menu.get(query);
  getResult.total = await Menu.getTotal();
  getResult.filtered = await Menu.getTotalFiltered(query);
  return getResult;
};

/**
* Save item
* @param {Object} context express request object
* @api public
*/
exports.save = async (context) => {
  const item = await Menu.store(context);
  return item;
};

/**
* Update item
* @param {Object} id express request id (string)
* @param {Object} object express request Object
* @api public
*/
exports.update = async (id, object) => {
  const item = object;
  item.updatedAt = moment().utcOffset('7').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
  await Menu.update(id, item);
  const result = await Menu.findById(id);
  return result;
};

/**
* Get One item By Id
* @param {Object} id express request id(string)
* @api public
*/
exports.findById = async (id) => {
  const item = await Menu.findById(id);
  return item;
};

/**
* Delete item By Id
* @param {Object} id express request id (string)
* @param {Object} object express request object
* @api public
*/
exports.deleteById = async (id) => {
  const deletedAt = {
    deletedAt: moment().utcOffset('7').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'),
  };
  await Menu.update(id, deletedAt);
  const res = await Menu.deleteById(id);
  return res;
};
