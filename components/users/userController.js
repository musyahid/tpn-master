
const userService = require('./userService');
const respond = require('../../libraries/utils/respond');

exports.index = async (req, res) => {
  const getResult = await userService.get(req.query);
  const meta = {};
  meta.total = getResult.total;
  meta.filtered = getResult.filtered;
  meta.currpage = (req.query.currpage) ? parseInt(req.query.currpage) : 0;
  meta.perpage = (req.query.perpage) ? parseInt(req.query.perpage) : 10;
  meta.totalpage = Math.ceil(meta.filtered / meta.perpage);
  return respond.resSuccessData(res, undefined, getResult.data, meta);
};

exports.store = async (req, res) => {
  const item = await userService.save(req.body);
  return respond.resCreated(res, undefined, item);
};

exports.activation = async (req, res) => {
  const item = await userService.activationUser(req.query);
  if (item.status) {
    return respond.resSuccessDataNoChange(res, 'User Already activated');
  }
  return respond.resSuccessData(res, 'User activated successfully');
};

exports.register = async (req, res) => {
  const item = await userService.register(req.body);
  return respond.resCreated(res, 'User Registered Succesfully', item);
};

exports.forgot = async (req, res) => {
  await userService.forgotPassword(req.body);
  return respond.resSuccessData(res, 'Check Your Email');
};


exports.changePass = async (req, res) => {
  await userService.changePassword(res.locals.decode, req.body);
  return respond.resSuccessData(res, 'Change Password Success');
};

exports.uploadAvatar = async (req, res) => {
  const { id } = req.params;
  const result = await userService.uploadAva(id, req.files.image);
  return respond.resSuccessData(res, 'Success', result);
};

exports.reset = async (req, res) => {
  const { token } = req.params;
  const { email } = req.query;
  const { password } = req.body;
  const item = await userService.resetPassword(token, email, password);
  return respond.resSuccessData(res, 'Change Password Success');
};

exports.show = async (req, res) => {
  const { id } = req.params;
  const result = await userService.findById(id);
  return respond.resSuccessData(res, undefined, result);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const result = await userService.update(id, req.body);
  return respond.resUpdated(res, undefined, result);
};

exports.updateProfile = async (req, res) => {
  const { id } = req.params;
  const result = await userService.updateProfile(id, req.body);
  return respond.resUpdated(res, undefined, result);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  const result = await userService.deleteById(id);
  return respond.resSuccessData(res, 'deleted', result);
};
