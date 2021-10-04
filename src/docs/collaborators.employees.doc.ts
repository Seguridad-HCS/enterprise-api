/**
 * @swagger
 * tags:
 *  name: Colaboradores - Empleados
 *  description: Altas, bajas y cambios en los empleados de la organizacion
 */

/**
 * @swagger
 * paths:
 *   /collaborators/employees:
 *     post:
 *       summary: Registra a un empleado en el sistema
 *       description: El empleado es registrado en el sistema, a partir de una serie de datos basicos, como restriccion solo puede existir un usuario con el mismo nombre dentro de la organizacion.
 *       tags: [Colaboradores - Empleados]
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
 *                   example: John
 *                 surname:
 *                   type: string
 *                   example: Doe
 *                 secondSurname:
 *                   type: string
 *                   example: Test
 *                 email:
 *                   type: string
 *                   example: example@test.com
 *                 nss:
 *                   type: string
 *                   example: 82962486
 *                 bloodtype:
 *                   type: string
 *                   example: A+
 *                 rfc:
 *                   type: string
 *                   example: MAVO980605Q23
 *                 birthDate:
 *                   type: string
 *                   example: 01-01-1998
 *                 sex:
 *                   type: boolean
 *                   example: true
 *                 baseWage:
 *                   type: number
 *                   example: 7000
 *                 locationProfileId:
 *                   type: number
 *                   example: 1
 *       responses:
 *         '200':    # status code
 *           description: El empleado fue registrado exitosamente
 *           content:
 *             application/json:
 *               schema: 
 *                 type: object
 *                 properties:
 *                   server:
 *                    type: string
 *                    example: Empleado registrado
 *         '401':
 *           description: El token utilizado es corrupto o inexistente
 *         '404':
 *           description: Llaves foraneas invalidas o incorrectas
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

/**
 * @swagger
 * paths:
 *   /collaborators/employees/{employeeId}:
 *     get:
 *       summary: Obtiene un empleado en especifico
 *       description: Muestra los datos de un empleado en especifico
 *       tags: [Colaboradores - Empleados]
 *       parameters:
 *       - name: token
 *         in: header
 *         required: true
 *       - name: employeeId
 *         in: path
 *         required: true
 *       responses:
 *         '200':    # status code
 *           description: Se muestran los datos asociados al empleado solicitado
 *           content:
 *             application/json:
 *               schema: 
 *                 type: object
 *                 properties:
 *                   employee:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: de157739-6a1a-4902-8690-85a8a8856295
 *                       name:
 *                         type: string
 *                         example: John
 *                       surname:
 *                         type: string
 *                         example: Doe
 *                       secondSurname:
 *                         type: string
 *                         example: Test
 *                       sex:
 *                         type: boolean
 *                         example: true
 *                       birthDate:
 *                         type: string
 *                         example: 01-01-1998
 *                       createdAt:
 *                         type: string
 *                         example: 01-0-1-2021
 *                       email:
 *                         type: string
 *                         example: example@test.com
 *                       nss:
 *                         type: string
 *                         example: 3263794
 *                       bloodtype:
 *                         type: string
 *                         examlpe: A+
 *                       rfc:
 *                         type: string
 *                         example: MASE000605Q23
 *                       baseWage:
 *                         type: number
 *                         example: 7000
 *                       profile:
 *                         type: object
 *                       position:
 *                         type: object
 *                       location:
 *                         type: onject        
 *         '401':
 *           description: El token utilizado es corrupto o inexistente
 *         '404':
 *           description: El empleado no fue encontrado
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

/**
 * @swagger
 * paths:
 *   /collaborators/employees/{employeeId}:
 *     delete:
 *       summary: Elimina a un empleado del sistema
 *       description: Elimina a un empleado del sistema
 *       tags: [Colaboradores - Empleados]
 *       parameters:
 *       - name: token
 *         in: header
 *         required: true
 *       - name: employeeId
 *         in: path
 *         required: true
 *       responses:
 *         '200':    # status code
 *           description: Empleado eliminado
 *           content:
 *             application/json:
 *               schema: 
 *                 type: object
 *                 properties:
 *                   employee:
 *                     type: object
 *                     properties:
 *                       server:
 *                         type: string
 *                         example: Colaborador eliminado 
 *         '401':
 *           description: El token utilizado es corrupto o inexistente
 *         '404':
 *           description: El empleado no fue encontrado
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