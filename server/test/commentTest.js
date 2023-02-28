const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const Article = require('../models/articleModel');
const Comment = require('../models/commentModel');
const jsonwebtoken = require("jsonwebtoken");

const JWT_SECRET = "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";

chai.use(chaiHttp);
chai.should();

describe('Comment', () => {
    let adminToken
    let userToken
    let clientId
    let articleId
    before(async () => {

        const clientRes = await chai.request(app)
        .post('/api/user/client/login')
        .send({ email: 'nshuti@gmail.com', password: 'password' })

        clientRes.body.should.have.property('token').not.null;
        userToken = clientRes.body.token;
        const clientDecoded = jsonwebtoken.verify(userToken, JWT_SECRET);
        console.log(clientDecoded)
        clientId = clientDecoded.user_id
        console.log(clientId)

        const adminRes = await chai.request(app)
        .post('/api/user/admin/login')
        .send({ email: 'nshuti@gmail.com', password: 'password' })

        adminRes.body.should.have.property('token').not.null;
        adminToken = adminRes.body.token;

        const articleRes = await chai.request(app)
        .post('/api/articles')
        .set('x-access-token', adminToken)
        .field('title', 'Article to be commented on and checked')
        .field('content', 'This article will be have a comment and will be checked for comments')
        .attach('image', 'test/testImage.jpeg')

        const article = articleRes.body.article
        console.log(articleRes.body)
        articleId = article._id
    });
    
    after(async () => {
        await Comment.deleteMany({});
    });

    describe('POST /api/articles/:id/comments', () => {
        it('should add a new comment to an article', async () => {
            const commentRes = await chai.request(app)
            .post(`/api/articles/${articleId}/comments`)
            .set('x-access-token', userToken)
            .send({
                comment: "unit test comment 1",
            })

            commentRes.should.have.status(201);
            commentRes.body.should.be.an('object');
            commentRes.body.should.have.property('message').eql('Comment added successfuly');
            commentRes.body.should.have.property('comment').should.be.an('object');
            commentRes.body.comment.should.have.property('articleId').eql(articleId);
            commentRes.body.comment.should.have.property('userId').eql(clientId);
            commentRes.body.comment.should.have.property('comment').eql('unit test comment 1');
        });
    })

    describe("GET /api/articles/:id/comments", () => {
        it("It should GET all article comments", async () => {
            const res = await chai.request(app)
            .get(`/api/articles/${articleId}/comments`)
            .set('x-access-token', adminToken)

            res.should.have.status(200);
            res.body.should.be.an('array');
        })
    })

})