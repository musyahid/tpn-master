const express = require('express');
const { validate } = require('express-validation');
const PermissionController = require('./permissionController');
const Permission = require('./permissionDAL');
const respond = require('../../libraries/utils/respond');
const auth = require('../../middlewares/auth');
const { create, update } = require('./permissionValidation');


const router = express.Router();

/* validate params here */
router.param('id', async (req, res, next, id) => {
  // TODO : check resource with the given id is exists
  const item = await Permission.findById(id);
  if (!item) {
    return respond.resNotFound(res, `Permission with id ${id} is not found`);
  }
  next();
});

/* get all */
router.get('/', auth, PermissionController.index);

// Get

router.post('/', auth, validate(create), PermissionController.store);

router.get('/:id', auth, PermissionController.show);

router.put('/:id', auth, validate(update), PermissionController.update);

router.delete('/:id', auth, PermissionController.delete);

module.exports = router;
