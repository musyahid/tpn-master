const organizationStructureService = require('./organizationStructureService');
const respond = require('../../libraries/utils/respond');

exports.store = async (req, res) => {
  const item = await organizationStructureService.save(req.body);
  return respond.resCreated(res, undefined, item);
};

exports.show = async (req, res) => {
  const { id } = req.params;
  const getResult = await organizationStructureService.findDescendants(id);
  return respond.resSuccessData(res, undefined, getResult);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const result = await organizationStructureService.update(id, req.body);
  return respond.resUpdated(res, undefined, result);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  const result = await organizationStructureService.deleteById(id);
  return respond.resSuccessData(res, 'deleted', result);
};

exports.findByLevel = async (req, res) => {
  const { id, level } = req.params;
  const result = await organizationStructureService.findNodeByLevel(id, level);
  return respond.resSuccessData(res, undefined, result);
};
