import { Router, Request, Response } from 'express';

import auth from 'routes/auth';
import hrRoutes from 'routes/hr.routes';

const router = Router();

router.get('/', (req:Request, res:Response) => {
    res.status(200).json('Ok')
})

// Collaborator routes
router.use('/collaborator', auth);
router.use('/collaborator/hr', hrRoutes);

export default router;