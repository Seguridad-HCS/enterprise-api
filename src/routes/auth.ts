import { Router, Request, Response } from 'express';

import login from '../controllers/collaborators/login.controller';
import logout from '../controllers/collaborators/logout.controller';
import verifyToken from '../middlewares/verifyToken.middleware';

const router = Router();

router.post('/login', login);
router.post('/logout', verifyToken, logout);

export default router;