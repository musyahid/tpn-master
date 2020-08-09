const express = require('express');
const { validate } = require('express-validation');
const RoleController = require('./roleController');
const Role = require('./roleDAL');
const respond = require('../../libraries/utils/respond');
const auth = require('../../middlewares/auth');
const { create, update } = require('./roleValidation');

const router = express.Router();

/* validate params here */
router.param('id', async (req, res, next, id) => {
  // TODO : check resource with the given id is exists
  const item = await Role.findById(id);
  if (!item) {
    return respond.resNotFound(res, `Role with id ${id} is not found`);
  }
  next();
});

/* get all */
router.get('/', auth, RoleController.index);

// Get

router.post('/', auth, validate(create), RoleController.store);


router.get('/:id', auth, RoleController.show);

router.put('/:id', auth, validate(update), RoleController.update);

router.delete('/:id', auth, RoleController.delete);


module.exports = router;
