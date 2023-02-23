const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const Article = require('../models/articleModel');
const Like = require('../models/likeModel')
const jsonwebtoken = require("jsonwebtoken");

const JWT_SECRET = "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";

chai.should();

chai.use(chaiHttp);

describe('Like', () => {
    let adminToken
    let userToken
    let articleId
    let clientId
    before(async () => {

        const clientRes = await chai.request(app)
        .post('/api/user/client/login')
        .send({ email: 'nshuti@gmail.com', password: 'password' })

        clientRes.body.should.have.property('token').not.null;
        userToken = clientRes.body.token;
        const clientDecoded = jsonwebtoken.verify(userToken, JWT_SECRET);
        clientId = clientDecoded.user_id
        console.log(clientId)

        const adminRes = await chai.request(app)
        .post('/api/user/admin/login')
        .send({ email: 'nshuti@gmail.com', password: 'password' })

        adminRes.body.should.have.property('token').not.null;
        adminToken = adminRes.body.token;
        const decoded = jsonwebtoken.verify(adminToken, JWT_SECRET);
        const adminId = decoded.userId
        console.log(adminId)

        const articleRes = await chai.request(app)
        .post('/api/articles')
        .set('x-access-token', adminToken)
        .field('title', 'Article to be liked and checked')
        .field('content', 'This article will be have a like and checked for likes')
        .attach('image', 'test/testImage.jpeg')

        const article = articleRes.body.article
        console.log(articleRes.body)
        articleId = article._id
    });

    after(async () => {
        await Like.deleteMany({});
    });

    describe('POST /api/articles/:id/likes', () => {
        it('should add a like to an article', async () => {
            const res = await chai.request(app)
            .post(`/api/articles/${articleId}/likes`)
            .set('x-access-token', userToken)
            .send({
                like: true,
            });
            
            res.should.have.status(201);
            res.body.should.be.an('object');
            res.body.should.have.property('message').eql('Article liked successfully')
            res.body.should.have.property('like').should.be.an('object')
            res.body.like.should.have.property('articleId').eql(articleId);
            res.body.like.should.have.property('userId').eql(clientId);
            res.body.like.should.have.property('like').eql(true);

        });
    });


    describe("GET /api/articles/:id/likes", () => {
        it("It should GET all article likes", async () => {
            const res = await chai.request(app)
            .get(`/api/articles/${articleId}/likes`)
            .set('x-access-token', adminToken)

            res.should.have.status(200);
            res.body.should.be.an('array');
        })
    })

})