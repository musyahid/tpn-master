const { create, update } = require('./positionSchemaValidation');
const positionService = require('./positionService');
const respond = require('../../libraries/utils/respond');

exports.index = async (req, res) => {
  const getResult = await positionService.get(req.query);
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
  await create.validateAsync(req.body, { abortEarly: false });
  const item = await positionService.save(req.body);
  return respond.resCreated(res, undefined, item);
};

exports.show = async (req, res) => {
  const { id } = req.params;
  const result = await positionService.findById(id);
  return respond.resSuccessData(res, undefined, result);
};

exports.update = async (req, res) => {
  await update.validateAsync(req.body, { abortEarly: true });
  const { id } = req.params;
  const result = await positionService.update(id, req.body);
  return respond.resUpdated(res, undefined, result);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  const result = await positionService.deleteById(id);
  return respond.resSuccessData(res, 'deleted', result);
};
