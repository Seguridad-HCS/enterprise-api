import { Router } from 'express';
import verifyToken from 'middlewares/verifyToken.middleware';

import postLocation from 'controllers/collaborators/postLocation.controller';
import deleteLocation from 'controllers/collaborators/deleteLocation.controller';
import getLocations from 'controllers/collaborators/getLocations.controller';
import getLocation from 'controllers/collaborators/getLocation.controller';

const router = Router();

router.post('/', verifyToken, postLocation);
router.delete('/:locationId', verifyToken, deleteLocation);
router.get('/', verifyToken, getLocations);
router.get('/:locationId', verifyToken, getLocation);

export default router;
