const express = require('express');
const organizationStructureController = require('./organizationStructureController');
const OrganizationStructureDAL = require('./organizationStructureDAL');
const respond = require('../../libraries/utils/respond');

const router = express.Router();


/* validate params here */
router.param('id', async (req, res, next, id) => {
  // TODO : check resource with the given id is exists
  const item = await OrganizationStructureDAL.findById(id);
  if (!item) {
    return respond.resNotFound(res, `Organization Structure with id ${id} is not found`);
  }
  next();
});

router.post('/', organizationStructureController.store);

router.get('/:id', organizationStructureController.show);

router.put('/:id', organizationStructureController.update);

router.delete('/:id', organizationStructureController.delete);

router.get('/:id/get-childs/:level', organizationStructureController.findByLevel);

module.exports = router;
