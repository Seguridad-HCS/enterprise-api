/**
 * @swagger
 * tags:
 *  name: Colaboradores - Perfiles de locacion
 *  description: Altas, bajas y cambios en los perfiles de cada locacion
 */

/**
 * @swagger
 * paths:
 *   /collaborators/locations/profiles:
 *     post:
 *       summary: Crea un nuevo perfil en la locacion
 *       description: El perfil solo puede ser creado si la locacion es externa (no tiene asociado ningun servicio) o si el servicio asociado a esa locacion se encuentra en etapa de registro
 *       tags: [Colaboradores - Perfiles de locacion]
 *       parameters:
 *       - name: token
 *         in: header
 *         required: true
 *       requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                total: 
 *                  type: number
 *                  example: 1
 *                minAge: 
 *                  type: number
 *                  example: 18
 *                maxAge:
 *                  type: number
 *                  example: 70
 *                price:
 *                  type: number
 *                  example: 35000
 *                minWage:
 *                  type: number
 *                  example: 8000
 *                maxWage:
 *                  type: number
 *                  example: 12000
 *                sex:
 *                  type: boolean
 *                  example: true
 *                position:
 *                  type: boolean
 *                  example: 1
 *                location:
 *                  type: number
 *                  example: 1
 *       responses:
 *         '201':    # status code
 *           description: El perfil fue creado exitosamente
 *           content:
 *             application/json:
 *               schema: 
 *                 type: object
 *                 properties: 
 *                   server:
 *                    type: string
 *                    example: Perfil creado
 *                   profile:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: number
 *                        example: 5
 *                      total:
 *                        type: number
 *                        example: 10
 *                      minAge:
 *                        type: number
 *                        example: 18
 *                      maxAge:
 *                        type: number
 *                        example: 70
 *                      price:
 *                        type: number
 *                        example: 8000
 *                      sex:
 *                        type: boolean
 *                        example: true
 *                      minWage:
 *                        type: number
 *                        example: 2000
 *                      maxWage:
 *                        type: number
 *                        example: 5000
 *                      positionId:
 *                        type: number
 *                        example: 1
 *                      locationId:
 *                        type: number
 *                        example: 1
 *         '405':
 *           description: El token utilizado es corrupto o inexistente
 */

/**
 * @swagger
 * paths:
 *   /collaborators/locations/profiles/{profileId}:
 *     delete:
 *       summary: Elimina un perfil en una locacion
 *       description: El perfil solo puede ser eliminado si la locacion asociada a el es interna o si el servicio asociado a la locacion se encunetra en la etapa de registro
 *       tags: [Colaboradores - Perfiles de locacion]
 *       parameters:
 *       - name: token
 *         in: header
 *         required: true
 *       - name: profileId
 *         in: path
 *         required: true
 *       responses:
 *         '200':    # status code
 *           description: El perfil fue eliminado exitosamente
 *           content:
 *             application/json:
 *               schema: 
 *                 type: object
 *                 properties: 
 *                   server:
 *                    type: string
 *                    example: Perfil eliminado
 *         '401':
 *           description: El token utilizado es corrupto o inexistente
 *         '404':
 *           description: El perfil no fue encontrado
 *         '405':
 *           description: La accion choca con alguna regla de negocio, leer el response para mas informacion
 *           content:
 *             application/json:
 *               schema: 
 *                 type: object
 *                 properties: 
 *                   server:
 *                    type: string
 *                    example: El perfil esta asociado a un servicio que no esta en etapa de registro
 *         
 */