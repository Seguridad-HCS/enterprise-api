import { Router } from 'express';

import postLocationProfile from 'controllers/collaborators/postLocationProfile.controller';
import deleteLocationProfile from 'controllers/collaborators/deleteLocationProfile.controller';

const router = Router();

router.post('/', postLocationProfile);
router.delete('/:profileId', deleteLocationProfile);

export default router;