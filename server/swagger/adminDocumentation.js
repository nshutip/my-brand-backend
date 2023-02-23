// for admin

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *      type: object
 *      properties:
 *       _id:
 *          type: string
 *          format: objectId
 *          example: 63e501bb572506f38a9ae298
 *       first_name:
 *          type: string
 *          example: nshuti
 *       last_name:
 *          type: string
 *          example: parfait
 *       email:
 *          type: string
 *          format: email
 *          example: nshuti@gmail.com
 *       password:
 *          type: string
 *          format: password
 *          example: password
 *       __v:
 *          type: integer
 *          example: 0
*/

/**
* @swagger
* /user/admin/login:
*   post:
*     tags:
*       - Admin
*     summary: admin login
*     description: admin login
*     operationId: adminLogin
*     requestBody:
*         description: Body to login an admin (need email,password)
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                  email:
*                      type: string
*                      format: email
*                      example: nshuti@gmail.com
*                  password:
*                      type: string
*                      format: password
*                      example: password
*     responses:
*       "200":
*           description: Success
*       '401':
*         description: Unauthorized
*       '400':
*         description: Bad Request
*       "409":
*           description: Conflict
*       '500':
*         description: Internal server error
*/

/**
 * @swagger
 * /user/admin/signup:
 *   post:
 *     tags:
 *       - Admin
 *     summary: add new admin user
 *     description: add new admin user
 *     operationId: adminSignup
 *     requestBody:
 *         description: Body to signup an admin (need first_name,last_name,email,password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  first_name:
 *                      type: string
 *                      example: swagger
 *                  last_name:
 *                       type: string
 *                       example: admin
 *                  email:
 *                      type: string
 *                      format: email
 *                      example: swagger@gmail.com
 *                  password:
 *                      type: string
 *                      format: password
 *                      example: password
 *     responses:
 *       "200":
 *           description: Success
 *       '401':
 *         description: Unauthorized
 *       '400':
 *         description: Bad Request
 *       "409":
 *           description: Conflict
 *       '500':
 *         description: Internal server error
 *     security:
 *       - bodyAuth: []
 *       - bearerAuth: []
 */


/**
 * @swagger
 * /user/admin/{id}:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: update admin information
 *     description: update admin information
 *     operationId: updateAdminInfo
 *     parameters:
 *       - name: id
 *         in: path
 *         description: admin Id to update the admin information
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *           example: 63e654de65d7988b9ae53e47
 *     requestBody:
 *       description: Update admin details
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                first_name:
 *                  type: string
 *                  example: swagger
 *                last_name:
 *                  type: string
 *                  example: adminUpdated
 *                email:
 *                  type: string
 *                  format: email
 *                  example: swaggerUpdated@gmail.com
 *
 *       required: true
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '409':
 *         description: Invalid input
 *       '500':
 *         description: Internal server error
 *     security: 
 *       - bodyAuth: []
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /user/admin:
 *   get:
 *     tags:
 *       - Admin
 *     summary: get all admin users
 *     description: get all admin users
 *     operationId: getAdmins
 *     responses:
 *       "200":
 *         description: Success
 *       '401':
 *         description: Unauthorized
 *       "500":
 *         description: Internal server error
 *     security:
 *       - bodyAuth: []
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /user/admin/{id}:
 *  delete:
 *     tags:
 *       - Admin
 *     summary: delete admin user
 *     description: delete admin user
 *     operationId: deleteAdmin
 *     parameters:
 *       - name: id
 *         in: path
 *         description: admin Id to delete
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *           example: 63f524d9149e1f9e50048bf3
 *     responses:
 *       '200':
 *         description: Successfull operation
 *       '404':
 *         description: user with that Id not found
 *       '401':
 *         description: Not Authorized
 *     security: 
 *       - bodyAuth: []
 *       - bearerAuth: [] 
 */

/**
 * @swagger
 * /user/client:
 *   get:
 *     tags:
 *       - Admin
 *     summary: get all client users
 *     description: get all client users
 *     operationId: getClients
 *     responses:
 *       "200":
 *         description: Success
 *       '401':
 *         description: Unauthorized
 *       "500":
 *         description: Internal server error
 *     security:
 *       - bodyAuth: []
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /user/client/{id}:
 *  delete:
 *     tags:
 *       - Admin
 *     summary: delete client user
 *     description: delete client user
 *     operationId: deleteUser
 *     parameters:
 *       - name: id
 *         in: path
 *         description: user Id to delete
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *           example: 63f525bc149e1f9e50048bf8
 *     responses:
 *       '200':
 *         description: Successfull operation
 *       '404':
 *         description: user with that Id not found
 *       '401':
 *         description: Not Authorized
 *     security: 
 *       - bodyAuth: []
 *       - bearerAuth: [] 
 */








