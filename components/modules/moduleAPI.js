const express = require('express');
const { validate } = require('express-validation');
const { create, update } = require('./moduleValidation');
const moduleController = require('./moduleController');
const Module = require('./moduleDAL');
const respond = require('../../libraries/utils/respond');

const router = express.Router();

/* validate params here */
router.param('id', async (req, res, next, id) => {
  // TODO : check resource with the given id is exists
  const item = await Module.findById(id);
  if (!item) {
    return respond.resNotFound(res, `User with id ${id} is not found`);
  }
  next();
});

router.get('/', moduleController.index);

router.post('/', validate(create), moduleController.store);

router.get('/:id', moduleController.show);

router.put('/:id', validate(update), moduleController.update);

router.delete('/:id', moduleController.delete);


module.exports = router;
