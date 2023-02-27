/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *      type: object
 *      properties:
 *       _id:
 *          type: string
 *          format: objectId
 *          example: 63a567bc2a672df0a5192bb8
 *       first_name:
 *          type: string
 *          format: 
 *          example: nshuti
 *       last_name:
 *          type: string
 *          format: 
 *          example: parfait
 *       email:
 *          type: string
 *          format: email
 *          example: client@gmail.com
 *       password:
 *          type: string
 *          format: password
 *          example: password
 *       __v:
 *          type: integer
 *          example: 0
 */

// 

/**
* @swagger
* /api/user/client/login:
*   post:
*     tags:
*       - User
*     summary: client login
*     description: client login
*     operationId: clientLogin
*     requestBody:
*         description: Body to login a client (need email,password)
*         content:
*           application/json:
*             schema:
*               type: object
*               required:
*                   - email
*                   - password
*               properties:
*                  email:
*                      type: string
*                      format: email
*                      example: client@gmail.com
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
 * /api/user/client/signup:
 *   post:
 *     tags:
 *       - User
 *     summary: add new client user
 *     description: add new client user
 *     operationId: clientSignup
 *     requestBody:
 *         description: Body to signup a user (need first_name,last_name,email,password)
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
 *                       example: user
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
 */

/**
 * @swagger
 * /api/user/client/{id}:
 *   patch:
 *     tags:
 *       - User
 *     summary: update user information
 *     description: update user information
 *     operationId: updateUserInfo
 *     parameters:
 *       - name: :id
 *         in: path
 *         description: user Id to update the user information
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *           example: 63e649a98087ba8fd7c3aa63
 *     requestBody:
 *       description: Update user details
 *       content:
 *         multipart/form-data:
 *           schema:
 *              type: object
 *              properties:
 *                first_name:
 *                  type: string
 *                  example: swagger
 *                last_name:
 *                  type: string
 *                  example: userUpdated
 *                image:
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
