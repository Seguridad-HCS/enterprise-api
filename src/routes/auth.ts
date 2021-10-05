import { Router, Request, Response } from 'express';

import login from 'controllers/collaborators/login.controller';
import logout from 'controllers/collaborators/logout.controller';
import rebootPassword from 'controllers/collaborators/rebootPassword.controller';
import recoverPassword from 'controllers/collaborators/recoverPassword.controller';

import verifyToken from '../middlewares/verifyToken.middleware';

const router = Router();

router.post('/login', login);
router.post('/logout', verifyToken, logout);
router.post('/reboot', rebootPassword);
router.put('/recover', recoverPassword);

export default router;
