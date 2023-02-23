// for articles

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *      type: object
 *      properties:
 *       _id:
 *         type: string
 *         format: objectId
 *         example: 63a567bc2a672df0a5192bb8
 *       title:
 *         type: string
 *         # format: int64
 *         example: Test article 15
 *       content:
 *         type: string
 *         # format: int32
 *         example: Test content 15
 *       image:
 *         type: string
 *         # format: int32
 *         example: image.jpeg
 *       comments:
 *         type: array
 *         items:
 *          type: object
 *          properties:
 *            _id:
 *              type: string
 *              format: objectId
 *              example: 63a567bc2a672df0a5192bb8
 *            userId:
 *              type: string
 *              format: objectId
 *              example: 63a567bc2a672df0a5192bb8
 *            articleId:
 *              type: string
 *              format: objectId
 *              example: 63a567bc2a672df0a5192bb8
 *            comment:
 *              type: string
 *              example: first swagger comment
 *       likes:
 *        type: array
 *        items:
 *          type: string
 *          format: objectId
 *          example: 63a567bc2a672df0a5192bb8
 *       __v:
 *        type: integer
 *        example: 1
 */

// 

/**
 * @swagger
 * /articles:
 *   get:
 *     tags:
 *       - Articles
 *     summary: get all articles
 *     description: get all articles
 *     operationId: viewArticles
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '500':
 *         description: Internal server error
 */


/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     tags:
 *       - Articles
 *     summary: get a single article
 *     description: get a single article
 *     operationId: viewArticle
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of article to return
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *           example: 63f11b6d75b85eeb64a5b443
 *     responses:
 *       '200':
 *         description: successful operation
 *       '500':
 *         description: Internal server error
 */

// Create an article
/**
 * @swagger
 * /articles:
 *   post:
 *     tags:
 *       - Articles
 *     summary: Add a new article
 *     description: Add a new article
 *     operationId: addarticle
 *     requestBody:
 *       description: Create a new article
 *       content:
 *         multipart/form-data:
 *           schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  example: article title 1
 *                content:
 *                  type: string
 *                  example: article content should be string of any size
 *                image:
 *                  type: string
 *                  example: data:img:png...
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
 * /articles/{id}:
 *   patch:
 *     tags:
 *       - Articles
 *     summary: update an article
 *     description: update an article
 *     operationId: updateArticle
 *     parameters:
 *       - name: id
 *         in: path
 *         description: article Id to update the article
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *           example: 63f11b6d75b85eeb64a5b443
 *     requestBody:
 *       description: Update article
 *       content:
 *         multipart/form-data:
 *           schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  example: article title 1
 *                content:
 *                  type: string
 *                  example: article content should be string of any size
 *                image:
 *                  type: string
 *                  format: binary
 *                  example: data:img:png...
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
 * /articles/{id}:
 *  delete:
 *     tags:
 *       - Articles
 *     summary: delete an article
 *     description: delete an article
 *     operationId: deleteArticle
 *     parameters:
 *       - name: id
 *         in: path
 *         description: article Id to delete
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *           example: 63f121817058013ccffc0306
 *     responses:
 *       '200':
 *         description: Successfull operation
 *       '404':
 *         description: article with that Id not found
 *       '401':
 *         description: Not Authorized
 *     security: 
 *       - bodyAuth: []
 *       - bearerAuth: [] 
 */

/**
 * @swagger
 * /articles/{id}/comments:
 *   post:
 *     tags:
 *       - Articles
 *     summary: add comment to an article
 *     description: add comment to an article
 *     operationId: postComment
 *     requestBody:
 *       description: Post a comment on an article
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: first swagger comment
 *       required: true
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of article to return
 *         required: true
 *         schema:
 *          type: string
 *          format: objectId
 *          example: 63f11b6d75b85eeb64a5b443
 *     responses:
 *       '200':
 *         description: successful operation
 *       '500':
 *         description: Internal server error
 *     security: 
 *       - bodyAuth: []
 *       - bearerAuth: [] 
 */


/**
 * @swagger
 * /articles/{id1}/comments:
 *  get:
 *     tags:
 *       - Articles
 *     summary: get all article comments
 *     description: get all article comments
 *     operationId: getComments
 *     parameters:
 *            - name: id1
 *              in: path
 *              description: ID of article to return
 *              required: true
 *              schema:
 *                  type: string
 *                  format: objectId
 *                  example: 63f11b6d75b85eeb64a5b443
 *     responses:
 *       '200':
 *         description: successful operation
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /articles/{id}/likes:
 *  post:
 *      tags:
 *          - Articles
 *      summary: Adding a like to an article
 *      description: Adding a like to an article
 *      operationId: postLike
 *      requestBody:
 *          description: Post a like on an article
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          like:
 *                              type: boolean
 *                              example: true
 *          required: true
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID of article to like
 *          required: true
 *          schema:
 *              type: string
 *              format: objectId
 *              example: 63f11b6d75b85eeb64a5b443
 *      responses:
 *          '200':
 *              description: successful operation
 *              content:
 *          '500':
 *              description: Internal server error
 *      security: 
 *          - bodyAuth: []
 *          - bearerAuth: [] 
 */


/**
 * @swagger
 * /articles/{id}/likes:
 *  get:
 *     tags:
 *       - Articles
 *     summary: get all article likes
 *     description: get all article likes
 *     operationId: getLikes
 *     parameters:
 *          - name: id
 *            in: path
 *            description: ID of article to return
 *            required: true
 *            schema:
 *                type: string
 *                format: objectId
 *                example: 63f11b6d75b85eeb64a5b443
 *     responses:
 *       '200':
 *         description: successful operation
 *       '500':
 *         description: Internal server error
 */




