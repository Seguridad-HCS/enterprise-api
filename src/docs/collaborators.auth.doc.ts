/**
 * @swagger
 * tags:
 *  name: Colaboradores - Autenticacion
 *  description: Auntentican a colaboradores dentro del sistema
 */

/**
 * @swagger
 * paths:
 *   /collaborators/auth/login:
 *     post:
 *       summary: Autentica a un colaborador en el sistema
 *       tags: [Colaboradores - Autenticacion]
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

/**
 * @swagger
 * paths:
 *   /collaborators/auth/logout:
 *     post:
 *       summary: Finaliza la sesion de un colaborador en el sistema
 *       tags: [Colaboradores - Autenticacion]
 *       parameters:
 *       - name: token
 *         in: header
 *         schema:
 *           type: string
 *       responses:
 *         '200':    # status code
 *           description: El ha finalizado sesion exitosamente
 *         '404':
 *          description: El token es corrupto
 */