module.exports = (req, res, next) => {
  if (req.headers['current-user']) {
    res.locals.currentUser = JSON.parse(req.headers['current-user']);
  }
  next();
};
