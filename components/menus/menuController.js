
const { create, update } = require('./menuValidation');
const menuService = require('./menuService');
const respond = require('../../libraries/utils/respond');

exports.index = async (req, res) => {
  const getResult = await menuService.get(req.query);
  const meta = {};
  // for datatables
  meta.total = getResult.total;
  meta.filtered = getResult.filtered;
  meta.currpage = (req.query.currpage) ? parseInt(req.query.currpage) : 0;
  meta.perpage = (req.query.perpage) ? parseInt(req.query.perpage) : 10;
  meta.totalpage = Math.ceil(meta.filtered / meta.perpage);
  return respond.resSuccessData(res, undefined, getResult.data, meta);
};

exports.store = async (req, res) => {
  // save consumer id
  const item = await menuService.save(req.body);
  return respond.resCreated(res, undefined, item);
};

exports.show = async (req, res) => {
  const { id } = req.params;
  const result = await menuService.findById(id);
  return respond.resSuccessData(res, undefined, result);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const result = await menuService.update(id, req.body);
  return respond.resUpdated(res, undefined, result);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  const result = await menuService.deleteById(id);
  return respond.resSuccessData(res, 'deleted', result);
};
