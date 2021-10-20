import { Router } from 'express';
import postService from 'controllers/collaborators/postService.controller';
import postServiceFile from 'controllers/collaborators/postServiceFile.controller';
import getService from 'controllers/collaborators/getService.controller';
import getServiceFile from 'controllers/collaborators/getServiceFile.controller';
import putServiceFileLock from 'controllers/collaborators/putServiceFileLock.controller';
import verifyToken from 'middlewares/verifyToken.middleware';

const router = Router();

router.post('/', verifyToken, postService);
router.get('/:serviceId', verifyToken, getService);
router.post('/:serviceId/file', verifyToken, postServiceFile);
router.get('/:serviceId/file', verifyToken, getServiceFile);
router.put('/:serviceId/file/lock', verifyToken, putServiceFileLock);

export default router;
