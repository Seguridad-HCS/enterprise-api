import { Router } from 'express';

import postPartner from 'controllers/collaborators/postPartner.controller';
import getPartners from 'controllers/collaborators/getPartners.controller';
import getPartner from 'controllers/collaborators/getPartner.controller';
import deletePartner from 'controllers/collaborators/deletePartner.controller';
import verifyToken from 'middlewares/verifyToken.middleware';

const router = Router();

router.post('/', verifyToken, postPartner);
router.get('/', verifyToken, getPartners);
router.delete('/:partnerId', verifyToken, deletePartner);
router.get('/:partnerId', verifyToken, getPartner);

export default router;