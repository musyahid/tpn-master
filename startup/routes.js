require('express-async-errors');
const userRoutes = require('../components/users/userAPI');
const userCutomRoutes = require('../components/users/userAPICustom');
const roleRoutes = require('../components/roles/roleAPI');
const permissionRoutes = require('../components/permissions/permissionAPI');
const positionRoutes = require('../components/positions/positionAPI');
const menuRoutes = require('../components/menus/menuAPI');
const moduleRoutes = require('../components/modules/moduleAPI');
const auth = require('../components/auth/authAPI');
const organizationStructureRoute = require('../components/organizationStructures/organizationStructureAPI');
const requestNotFound = require('../middlewares/requestNotFound');
const error = require('../middlewares/error');

module.exports = (app) => {
  app.use('/api/v1', userCutomRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/roles', roleRoutes);
  app.use('/api/v1/permissions', permissionRoutes);
  app.use('/api/v1/menus', menuRoutes);
  app.use('/api/v1/position', positionRoutes);
  app.use('/api/v1/modules', moduleRoutes);
  app.use('/api/v1/auth', auth);
  app.use('/api/v1/organization-structures', organizationStructureRoute);
  app.use(requestNotFound);
  app.use(error);
};
