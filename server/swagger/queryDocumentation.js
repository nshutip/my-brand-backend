/**
 * @swagger
 * components:
 *   schemas:
 *     Query:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *         name:
 *           type: string
 *           # format: int64
 *         email:
 *           type: string
 *         message:
 *           type: string
 *
 *
 * @swagger
 * /queries:
 *   post:
 *     tags:
 *       -  Queries
 *     summary: create a query
 *     description: create a query
 *     requestBody:
 *       description: Post a message to connect from contact page
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nshuti Parfait
 *               email:
 *                 type: string
 *                 format: email
 *                 example: nshuti@gmail.com
 *               message:
 *                 type: string
 *                 example: I am a software engineer
 *             required:
 *               - name
 *               - email
 *               - message
 *       required: true
 *     responses:
 *       '200':
 *         description: successful operation
 *       '500':
 *         description: Internal server error
 */

//  get all queries

/**
 * @swagger
 * /queries:
 *    get:
 *       tags:
 *         -  Queries
 *       summary: get all queries
 *       description: get all queries
 *       operationId: getMessages
 *       responses:
 *         '200':
 *           description: successful operation
 *         '404':
 *           description: No messages found
 *         '500':
 *           description: Internal server error
 *       security: 
 *       - bodyAuth: []
 *       - bearerAuth: [] 
 */