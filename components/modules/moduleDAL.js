const { Module } = require('./module');
const utils = require('../../libraries/utils/index');

/**
* Get all item
* @param {Object} req express request object
* @param {Object} res express response object
* @api public
*/

exports.get = async (query) => {
  try {
    const perpage = (query.perpage) ? parseInt(query.perpage) : 10;
    const currpage = (query.currpage) ? parseInt(query.currpage) : 0;
    query['sort-created.at'] = (query['sort-created.at']) ? query['sort-created.at'] : -1;

    // merge array of object, the result will be merged in array1
    let arrayOr = utils.getQueryOr(query, 'likeor-', 'like');
    const arrayOr2 = utils.getQueryOr(query, 'filteror-');
    Array.prototype.push.apply(arrayOr, arrayOr2);
    // filter empty object
    arrayOr = arrayOr.filter((value) => Object.keys(value).length > 0);
    // if empty, add
    if (arrayOr.length == 0) {
      arrayOr.push({});
    }

    const result = await Module.aggregate([
      {
        $match: {
          $or: arrayOr,
          ...utils.getQuery(query, 'filterin-', 'in'),
          ...utils.getQuery(query, 'filter-'),
          ...utils.getQuery(query, 'exists-', 'exists'),
          ...utils.getQuery(query, 'filternum-', 'number'),
          ...utils.getQuery(query, 'filterobjid-', 'objid'),
          ...utils.getQuery(query, 'bool-', 'bool'),
          ...utils.getQuery(query, 'like-', 'like'),
          ...utils.betweenDate(utils.getQuery(query, 'between-')),
        },  
       
      },
    ])
      .collation({ locale: 'en', strength: 2 })
      .sort(utils.getQuery(query, 'sort-'))
      .skip(currpage * perpage)
      .limit(perpage);

    

    return result;
  } catch (e) {
    console.log(e);
  }
};

exports.getOne = async (query) => {
  const result = await Module.findOne({
    ...utils.getQuery(query, 'filterin-', 'in'),
    ...utils.getQuery(query, 'filter-'),
    ...utils.getQuery(query, 'exists-', 'exists'),
    ...utils.getQuery(query, 'filternum-', 'number'),
    ...utils.getQuery(query, 'filterobjid-', 'objid'),
    ...utils.getQuery(query, 'bool-', 'bool'),
    ...utils.getQuery(query, 'like-', 'like'),
    ...utils.betweenDate(utils.getQuery(query, 'between-')),
  })
    .collation({ locale: 'en' })
    .sort(utils.getQuery(query, 'sort-'));
  return result;
};


exports.getTotal = async () => {
  const result = await Module.countDocuments({});
  return result;
};

/**
* Get count all purchase number based on filter
* @param {object} query query string
* @api public
*/
exports.getTotalFiltered = async (query) => {
  // merge array of object, the result will be merged in array1
  let arrayOr = utils.getQueryOr(query, 'likeor-', 'like');
  const arrayOr2 = utils.getQueryOr(query, 'filteror-');
  Array.prototype.push.apply(arrayOr, arrayOr2);
  // filter empty object
  arrayOr = arrayOr.filter((value) => Object.keys(value).length > 0);
  // if empty, add
  if (arrayOr.length == 0) {
    arrayOr.push({});
  }
  const result = await Module.aggregate([
    {
      $match: {
        $or: arrayOr,
        ...utils.getQuery(query, 'filterin-', 'in'),
        ...utils.getQuery(query, 'filter-'),
        ...utils.getQuery(query, 'exists-', 'exists'),
        ...utils.getQuery(query, 'filternum-', 'number'),
        ...utils.getQuery(query, 'filterobjid-', 'objid'),
        ...utils.getQuery(query, 'bool-', 'bool'),
        ...utils.getQuery(query, 'like-', 'like'),
        ...utils.betweenDate(utils.getQuery(query, 'between-')),
      },
    },
    {
      $group: { _id: null, count: { $sum: 1 } },
    },
    {
      $project: { _id: 0, count: 1 },
    },
  ]);

  if (result[0]) {
    return result[0].count;
  }
  return 0;
};

exports.save = async (context) => {
  let item = new Module(context);
  item = await item.save();

  return item;
};

exports.findById = async (id) => {
  pathPermission = { path: 'permissionId', select: ['name', 'description']};
  item = await Module.findOne({ _id: id }).populate(pathPermission);
  return item;
};

exports.update = async (item) => {
  item = await item.save();
  return item;
};

exports.deleteById = async (id) => {
  item = await Module.findOneAndDelete({ _id: id });
  return item;
};

exports.findByNik = async (value) => {
  item = await Module.findOne({ nik: value });
  return item;
};
