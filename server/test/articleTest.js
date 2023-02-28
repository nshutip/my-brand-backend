const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const Article = require('../models/articleModel');
const { object } = require('joi');

chai.use(chaiHttp);
chai.should();
                              
describe('Articles API', () => {
    let adminToken
    let updateArticleId
    let deleteArticleId
    before(async() => {
        const adminRes = await chai.request(app)
        .post('/api/user/admin/login')
        .send({ email: 'nshuti@gmail.com', password: 'password' })

        adminRes.body.should.have.property('token').not.null;
        adminToken = adminRes.body.token;

        const deleteArticleRes = await chai.request(app)
        .post('/api/articles')
        .set('x-access-token', adminToken)
        .field('title', 'Article to be updated and deleted')
        .field('content', 'This article will be updated and will be deleted')
        .attach('image', 'test/testImage.jpeg')

        const deleteArticle = deleteArticleRes.body.article
        deleteArticleId = deleteArticle._id

        const updateArticleRes = await chai.request(app)
        .post('/api/articles')
        .set('x-access-token', adminToken)
        .field('title', 'Article to be updated and deleted')
        .field('content', 'This article will be updated and will be deleted')
        .attach('image', 'test/testImage.jpeg')

        const updateArticle = updateArticleRes.body.article
        updateArticleId = updateArticle._id
    });
    
    after(async () => {
        await Article.deleteMany({});
    });

    describe('GET /api/articles', () => {
        it('should get all articles', (done) => {
            chai.request(app)
            .get('/api/articles')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array');
                done();
            });
        });
    });

    describe('POST /api/articles', () => {
        it('should add a new article', (done) => {
            chai.request(app)
            .post('/api/articles')
            .set('x-access-token', adminToken)
            .field('title', 'test article unit test 1')
            .field('content', 'test content unit test 1')
            .attach('image', 'test/testImage.jpeg')
            .end(async (err, res) => {
                let articleId
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('message').eql('Article added successfuly');
                res.body.should.have.property('article').should.be.an('object').not.null;
                articleId = res.body.article._id
                console.log(articleId)
                await Article.findById(articleId, (err, article) => {
                    chai.assert.equal(article.title, 'test article unit test 1');
                    chai.assert.typeOf(article.image, 'string');
                    chai.assert.isNotNull(article.image);
                    chai.assert.equal(article.content, 'test content unit test 1');
                    done();
                });
            });

        });
    });

    describe('PATCH /api/articles/:id', () => {
        it('should update an existing article', async () => {
            const res = await chai.request(app)
            .patch(`/api/articles/${updateArticleId}`)
            .set('x-access-token', adminToken)
            .send({ content: 'This is an updated article' })

            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.should.have.property('content').eql('This is an updated article');
        });
    });

    describe('DELETE /api/articles/:id', () => {
        it('should delete an article', async () => {
            const res = await chai.request(app)
            .delete(`/api/articles/${deleteArticleId}`)
            .set('x-access-token', adminToken)

            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.should.have.property('message').eql('Article deleted successfuly');
            
            Article.findById(deleteArticleId, (err, article) => {
                chai.assert.isNull(err);
                chai.assert.isNull(article);
            });
        });
    });    
});
