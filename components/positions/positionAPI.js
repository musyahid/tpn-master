const express = require('express');
const PositionController = require('./positionController');
const Position = require('./positionDAL');
const respond = require('../../libraries/utils/respond');
const schema = require('./positionSchemaValidation');
const auth = require('../../middlewares/auth');

const router = express.Router();

/* validate params here */
router.param('id', async (req, res, next, id) => {
  // TODO : check resource with the given id is exists
  const item = await Position.findById(id);
  if (!item) {
    return respond.resNotFound(res, `Permission with id ${id} is not found`);
  }
  next();
});

/* get all */
router.get('/', (req, res, next) => {
  res.locals.function_id = 'user-index';
  next();
},
PositionController.index);

// Get

router.post('/', PositionController.store);

router.get('/:id', PositionController.show);

router.put('/:id', PositionController.update);

router.delete('/:id', PositionController.delete);

module.exports = router;
