import { Router } from 'express';
import postServiceFile from 'controllers/collaborators/postServiceFile.controller';
import verifyTokenMiddleware from 'middlewares/verifyToken.middleware';

const router = Router();

router.post('/', verifyTokenMiddleware, postServiceFile);

export default router;