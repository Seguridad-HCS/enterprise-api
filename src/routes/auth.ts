import { Router, Request, Response } from 'express';

import login from '../controllers/collaborators/auth/login.controller';
import logout from '../controllers/collaborators/auth/logout.controller';
import verifyToken from '../middlewares/verifyToken.middleware';

const router = Router();

// @route GET /login
// @desc Authenticate a user
// @access PUBLIC
/**
 * @swagger
 * tags:
 *  name: Colaboradores en general
 *  description: Endpoints a los cuales tiene acceso cualquier empleado
 */

/**
 * @swagger
 * paths:
 *   /collaborator/login:
 *     post:
 *       summary: Autentica a un collaborador en la plataforma
 *       tags: [Colaboradores en general]
 *       requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email: 
 *                  type: string
 *                  example: oscarmartinez1998lol@gmail.com
 *                password: 
 *                  type: string
 *                  example: test
 *       responses:
 *         '200':    # status code
 *           description: El usuario fue autenticado exitosamente
 *           headers:
 *            token:
 *              description: Token de autenticacion del usuario
 *              type: string
 *           content:
 *             application/json:
 *               schema: 
 *                 type: object
 *                 properties: 
 *                   name: 
 *                    type: string
 *                   role:
 *                    type: string
 *         '404':
 *          description: El email o la contraseña son incorrectos
 */
router.post('/login', login);
router.post('/logout', verifyToken, logout);

export default router;