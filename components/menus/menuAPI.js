const express = require('express');
const { validate } = require('express-validation');
const menuController = require('./menuController');
const Menu = require('./menu');
const { create, update } = require('./menuValidation');
const respond = require('../../libraries/utils/respond');

const router = express.Router();

/* validate params here */
router.param('id', async (req, res, next, id) => {
  // TODO : check resource with the given id is exists

  const item = await Menu.findById({ _id: id });
  if (!item) {
    return respond.resNotFound(res, `Menu with id ${id} is not found`);
  }
  next();
});

router.get('/', menuController.index);

router.post('/', validate(create), menuController.store);

router.get('/:id', menuController.show);

router.put('/:id', validate(update), menuController.update);

router.delete('/:id', menuController.delete);


module.exports = router;
