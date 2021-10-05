/**
 * @swagger
 * tags:
 *  name: Colaboradores - Locaciones
 *  description: Altas, bajas y cambios en las locaciones de la organizacion
 */

/**
 * @swagger
 * paths:
 *   /collaborators/locations:
 *     post:
 *       summary: Registra una locacion
 *       description:  Dentro del sistema si el campo service esta vacio, entonces la locacion sera interna de HCS, de lo contrario estara asociada a un servicio de un socio y este a su vez debe estar en la etapa de registro, de lo contrario retornara un error.
 *       tags: [Colaboradores - Locaciones]
 *       parameters:
 *       - name: token
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *       requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: Oficinas de pruebas
 *                address:
 *                  type: object
 *                  properties:
 *                    street:
 *                      type: string
 *                      example: test st.
 *                    outNumber:
 *                      type: string
 *                      example: Mz. 21 Lt.18
 *                    intNumber:
 *                      type: string
 *                      example: N/A
 *                    neighborhood:
 *                      type: string
 *                      example: Fraccionamiento de prueba
 *                    zip:
 *                      type: string
 *                      example: 09970
 *                    municipality:
 *                      type: string
 *                      example: Gustavo A. Madero
 *                    state:
 *                      type: string
 *                      example: Ciudad De Mexico
 *       responses:
 *         '201':    # status code
 *           description: La locacion fue registrada exitosamente
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   server:
 *                    type: string
 *                   location:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                        example: 1
 *                      name:
 *                        type: string
 *                        example: Oficinas de pruebas
 *                      address:
 *                        type: object
 *                        properties:
 *                          street:
 *                            type: string
 *                            example: test st.
 *                          outNumber:
 *                            type: string
 *                            example: Mz. 21 Lt.18
 *                          intNumber:
 *                            type: string
 *                            example: N/A
 *                          neighborhood:
 *                            type: string
 *                            example: Fraccionamiento de prueba
 *                          zip:
 *                            type: string
 *                            example: 09970
 *                          municipality:
 *                            type: string
 *                            example: Gustavo A. Madero
 *                          state:
 *                            type: string
 *                            example: Ciudad De Mexico
 *         '405':
 *           description: El token no es valido
 *         '400':
 *           description: El servidor encontro un error en la logica del proceso, hay mas detalles en el body
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   server:
 *                    type: string
 *                    description: Describe el error causado en el server
 *         '500':
 *           description: Error interno del servidor, hay mas detalles en el body
 *           content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  server:
 *                   type: string
 *                   description: Describe el error causado en el server
 */

/**
 * @swagger
 * paths:
 *  /collaborators/locations:
 *    get:
 *      summary: Obtiene las locaciones de la organizacion
 *      description: Obtiene un arreglo con las locaciones solicitadas, si no se incluye ningun parametro regresa todas las locaciones, en caso contrario obtiene locaciones internas y externas.
 *      tags: [Colaboradores - Locaciones]
 *      parameters:
 *        - name: token
 *          in: header
 *          required: true
 *          schema:
 *            type: string
 *        - name: owner
 *          in: query
 *          required: false
 *          description: Si se coloca 0 obtiene las locaciones internas de la empresa, si se coloca 1 se obtiene las locaciones externas, si no se coloca ninguna arroja todas las locaciones registradas.
 *          schema:
 *            type: integer
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

/**
 * @swagger
 * paths:
 *  /collaborators/locations/{locationId}:
 *    delete:
 *      summary: Elimina una locacion
 *      description: Elimina una locacion solicitada, la unica condicion para que esto se realize de forma exitosa es que esta no tenga a ningun colaborador asociado a ella y esta no pertenezca a un servicio en negociacion, preactivo, activo o finalizado.
 *      tags: [Colaboradores - Locaciones]
 *      parameters:
 *        - name: token
 *          in: header
 *          required: true
 *          schema:
 *            type: string
 *        - name: locationId
 *          in: path
 *          required: true
 *          description: Colocar el ID de la locacion que desea ser eliminada
 *          schema:
 *            type: integer
 *      responses:
 *          '200':
 *            description: La locacion ha sido eliminada exitosamente
 *          '405':
 *            description: No se puede realizar la accion debido a una restriccion con la logica de la empresa
 *          '404':
 *            description: La locacion solicitada no se encuentra
 *          '401':
 *            description: El usuario no cuenta con los permisos para realizar esta accion
 */

/**
 * @swagger
 * paths:
 *  /collaborators/locations/{locationId}:
 *    get:
 *      summary: Obtiene una locacion especifica
 *      description: Obtiene los datos de una locacion
 *      tags: [Colaboradores - Locaciones]
 *      parameters:
 *        - name: token
 *          in: header
 *          required: true
 *          schema:
 *            type: string
 *        - name: locationId
 *          in: path
 *          required: true
 *          description: Colocar el ID de la locacion que desea ser eliminada
 *          schema:
 *            type: integer
 *      responses:
 *          '200':
 *            description: Muestra los datos de la locacion solicitada
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                    name:
 *                      type: string
 *                    service:
 *                      type: string
 *                    status:
 *                      type: string
 *                    address:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: number
 *                        street:
 *                          type: string
 *                        intNumber:
 *                          type: string
 *                        outNumber:
 *                          type: string
 *                        neighborhood:
 *                          type: string
 *                        municipality:
 *                          type: string
 *                        state:
 *                          type: string
 *                        zip:
 *                          type: string
 *                    profiles:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: number
 *                            example: 1
 *                          total:
 *                            type: number
 *                            example: 1
 *                          minAge:
 *                            type: number
 *                            example: 18
 *                          maxAge:
 *                            type: number
 *                            example: 75
 *                          sex:
 *                            type: boolean
 *                            example: true
 *                          position:
 *                            type: object
 *                            properties:
 *                              id:
 *                                type: number
 *                                example: 1
 *                              name:
 *                                type: number
 *                                example: Este es un puesto de prueba
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
 *          '404':
 *            description: La locacion solicitada no se encuentra
 *          '401':
 *            description: El usuario no cuenta con los permisos para realizar esta accion
 */
