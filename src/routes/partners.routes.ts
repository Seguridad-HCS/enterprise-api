import { Router } from 'express';

import postPartner from 'controllers/collaborators/postPartner.controller';
import getPartners from 'controllers/collaborators/getPartners.controller';
import getPartner from 'controllers/collaborators/getPartner.controller';
import deletePartner from 'controllers/collaborators/deletePartner.controller';
import verifyToken from 'middlewares/verifyToken.middleware';
import postPartnerContact from 'controllers/collaborators/postPartnerContact.controller';
import deletePartnerContact from 'controllers/collaborators/deletePartnerContact.controller';

const router = Router();

router.get('/', verifyToken, getPartners);
router.get('/:partnerId', verifyToken, getPartner);
router.post('/', verifyToken, postPartner);
router.post('/contacts', verifyToken, postPartnerContact);
router.delete('/:partnerId', verifyToken, deletePartner);
router.delete('/contacts/:contactId', verifyToken, deletePartnerContact);

export default router;
