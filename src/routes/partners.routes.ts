import { Router } from 'express';

import postPartner from 'controllers/collaborators/postPartner.controller';
import getPartners from 'controllers/collaborators/getPartners.controller';
import getPartner from 'controllers/collaborators/getPartner.controller';
import deletePartner from 'controllers/collaborators/deletePartner.controller';
import verifyToken from 'middlewares/verifyToken.middleware';
import postPartnerContact from 'controllers/collaborators/postPartnerContact.controller';
import deletePartnerContact from 'controllers/collaborators/deletePartnerContact.controller';
import putBilling from 'controllers/collaborators/putBilling.controller';
import putBillingAddress from 'controllers/collaborators/putBillingAddress.controller';
import postBillingProcess from 'controllers/collaborators/postBillingProcess.controller';

const router = Router();

router.get('/', verifyToken, getPartners);
router.post('/', verifyToken, postPartner);

router.get('/:partnerId', verifyToken, getPartner);
router.delete('/:partnerId', verifyToken, deletePartner);

router.put('/:partnerId/billing', verifyToken, putBilling);
router.put('/:partnerId/billing/address', verifyToken, putBillingAddress);
router.post('/:partnerId/billing/process', verifyToken, postBillingProcess);

router.post('/contacts', verifyToken, postPartnerContact);
router.delete('/contacts/:contactId', verifyToken, deletePartnerContact);

export default router;
