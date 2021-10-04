import { Router } from 'express';
import postService from 'controllers/collaborators/postService.controller';
import verifyToken from 'middlewares/verifyToken.middleware';

const router = Router();

router.post('/', verifyToken, postService);

export default router;