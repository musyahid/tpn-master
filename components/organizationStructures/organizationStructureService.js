const organizationStructureDAL = require('./organizationStructureDAL');

exports.findDescendants = async (id) => {
  const result = await organizationStructureDAL.findDescendants(id);
  return result;
};

exports.save = async (context) => {
  const item = await organizationStructureDAL.save(context);
  return item;
};

exports.update = async (id, object) => {
  const item = object;
  await organizationStructureDAL.update(id, item);
  const result = await organizationStructureDAL.findById(id);
  return result;
};

exports.deleteById = async (id) => {
  const res = await organizationStructureDAL.deleteById(id);
  return res;
};

exports.findNodeByLevel = async (id, level) => {
  const res = await organizationStructureDAL.findNodeByLevel(id, level);
  return res;
};
