const express = require('express');
const { validate } = require('express-validation');
const UserController = require('./userController');
const User = require('./user');
const respond = require('../../libraries/utils/respond');
const {
  create, update, changePassword,
} = require('./userValidation');


const router = express.Router();

/* validate params here */
router.param('id', async (req, res, next, id) => {
  // TODO : check resource with the given id is exists
  const item = await User.findById(id);
  if (!item) {
    return respond.resNotFound(res, `User with id ${id} is not exists.`);
  }
  next();
});
router.get('/', UserController.index);

router.post('/', validate(create), UserController.store);

router.post('/change-password', validate(changePassword), UserController.changePass);

router.get('/:id', UserController.show);

router.post('/:id/upload', UserController.uploadAvatar);

router.put('/:id', validate(update), UserController.update);

router.delete('/:id', UserController.delete);

module.exports = router;
