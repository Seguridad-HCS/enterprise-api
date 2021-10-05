import { Router } from 'express';
import postService from 'controllers/collaborators/postService.controller';
import getService from 'controllers/collaborators/getService.controller';
import verifyToken from 'middlewares/verifyToken.middleware';

const router = Router();

router.post('/', verifyToken, postService);
router.get('/:serviceId', verifyToken, getService);

export default router;
