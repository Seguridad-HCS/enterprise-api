import { Router, Request, Response } from 'express';
import getEmployee from 'controllers/collaborators/getEmployee.controller';
import verifyToken from 'middlewares/verifyToken.middleware';
import postEmployee from 'controllers/collaborators/postEmployee.controller';
import deleteEmployee from 'controllers/collaborators/deleteEmployee.controller';

const router = Router();

router.post('/', verifyToken, postEmployee);
router.get('/:employeeId', verifyToken, getEmployee);
router.delete('/:employeeId', verifyToken, deleteEmployee);

export default router;