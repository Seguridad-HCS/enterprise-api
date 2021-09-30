import { Router } from 'express';

import postPartner from 'controllers/collaborators/postPartner.controller';
import getPartners from 'controllers/collaborators/getPartners.controller';
import getPartner from 'controllers/collaborators/getPartner.controller';
import deletePartner from 'controllers/collaborators/deletePartner.controller';
import verifyToken from 'middlewares/verifyToken.middleware';
import postPartnerContact from 'controllers/collaborators/postPartnerContact.controller';

const router = Router();

router.post('/', verifyToken, postPartner);
router.get('/', verifyToken, getPartners);
router.post('/contacts', verifyToken, postPartnerContact);
//router.post('/contacts/{contactId}', verifyToken, deletePartnerContact);
router.delete('/:partnerId', verifyToken, deletePartner);
router.get('/:partnerId', verifyToken, getPartner);

export default router;