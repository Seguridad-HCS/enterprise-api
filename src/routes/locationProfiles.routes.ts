import { Router } from 'express';

import postLocationProfile from 'controllers/collaborators/postLocationProfile.controller';
import deleteLocationProfile from 'controllers/collaborators/deleteLocationProfile.controller';
import verifyToken from 'middlewares/verifyToken.middleware';

const router = Router();

router.post('/', verifyToken, postLocationProfile);
router.delete('/:profileId', verifyToken, deleteLocationProfile);

export default router;