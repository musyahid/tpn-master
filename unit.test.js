require('dotenv').config({ path: './tests/.env.test' });
require('./components/roles/roleUnitTest');
require('./components/permissions/permissionUnitTest');
require('./components/menus/menuUnitTest');
require('./components/users/userUnitTest');
require('./components/positions/positionUnitTest');
require('./components/organizationStructures/organizationStructureUnitTest');
