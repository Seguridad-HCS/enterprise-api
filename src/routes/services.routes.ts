import { Router } from 'express';
import postService from 'controllers/collaborators/postService.controller';
import postServiceFile from 'controllers/collaborators/postServiceFile.controller';
import getService from 'controllers/collaborators/getService.controller';
import getServiceFile from 'controllers/collaborators/getServiceFile.controller';
import verifyToken from 'middlewares/verifyToken.middleware';

const router = Router();

router.post('/', verifyToken, postService);
router.post('/files', verifyToken, postServiceFile);
router.get('/:serviceId', verifyToken, getService);
router.get('/:serviceId/:fileName', verifyToken, getServiceFile);

export default router;
