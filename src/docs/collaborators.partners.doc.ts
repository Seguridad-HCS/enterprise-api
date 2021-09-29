/**
 * @swagger
 * tags:
 *  name: Colaboradores - Socios
 *  description: Altas, bajas y cambios en los socios de la organizacion
 */

/**
 * @swagger
 * paths:
 *   /collaborators/partners:
 *     post:
 *       summary: Registra a un socio en el sistema
 *       description: Elimina a un empleado del sistema
 *       tags: [Colaboradores - Socios]
 *       parameters:
 *       - name: token
 *         in: header
 *         required: true
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name: 
 *                   type: string
 *                   example: Empresa de pruebas
 *                 legalName:
 *                   type: string
 *                   example: Empresa de pruebas S.A. de C.V.
 *                 representative:
 *                   type: string
 *                   example: John Doe Test
 *                 rfc:
 *                   type: string
 *                   example: MJO002356S76
 *                 email:
 *                   type: string
 *                   example: ejemplo@test.com
 *                 phoneNumber:
 *                   type: string
 *                   example: +524458275377
 *       responses:
 *         '201':    # status code
 *           description: Socio creado
 *           content:
 *             application/json:
 *               schema: 
 *                 type: object
 *                 properties:
 *                   server:
 *                     type: string
 *                     example: Socio creado
 *                   partner:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 1d3f1294-9eb5-481a-987e-8896e67ab651
 *                       name:
 *                         type: string
 *                         example: Empresa de pruebas
 *                       legalName:
 *                         type: string
 *                         example: Empresa de pruebas S.A. de C.V.
 *                       representative:
 *                         type: string
 *                         example: John Doe Test
 *                       rfc:
 *                         type: string
 *                         example: MJO002356S76
 *                       email: 
 *                         type: string
 *                         example: ejemplo@test.com
 *                       phoneNumber:
 *                         type: string
 *                         example: +524458275377  
 *         '401':
 *           description: El token utilizado es corrupto o inexistente
 *         '405':
 *           description: La accion choca con alguna regla de negocio, leer el response para mas informacion
 *           content:
 *             application/json:
 *               schema: 
 *                 type: object
 *                 properties: 
 *                   server:
 *                    type: string
 *                    example: El empleado actualmente tiene funciones activas en el sistema
 *         
 */

/**
 * @swagger
 * paths:
 *   /collaborators/partners:
 *     get:
 *      summary: Obtiene los socios registrados en el sistema.
 *      description: Obtiene un arreglo con los socios registrados en el sistema.
 *      tags: [Colaboradores - Socios]
 *      parameters:
 *        - name: token
 *          in: header
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *          '200':    # status code
 *            description: Muestra la lista de instalaciones
 *            content:
 *              application/json:
 *                schema: 
 *                  type: object
 *                  properties: 
 *                    server: 
 *                      type: string
 *                    locations:
 *                      type: array
 *                      items: 
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: number
 *                            example: 1
 *                          name:
 *                            type: string
 *                            example: Oficina de pruebas
 *                          owner:
 *                            type: string
 *                            example: Corporativo HCS
 *                          address:
 *                            type: object
 *                            properties:
 *                              id:
 *                                type: number
 *                                example: 1
 *                              municipality:
 *                                type: string
 *                                example: Gustavo A. Madero
 *                              state:
 *                                type: string
 *                                example: CDMX
 *                          hr:
 *                            type: object
 *                            properties:
 *                              total:
 *                                type: integer
 *                                example: 15
 *                              hired:
 *                                type: integer
 *                                example: 10
 */