import { Router, Request, Response } from 'express';

const router = Router();

// @route GET /login
// @desc Authenticate a user
// @access PUBLIC
router.post('/employee', (req: Request, res: Response ) => {
    res.status(200).json({
        server: 'Registro exitoso'
    });
});

export default router;