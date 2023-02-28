const app = require("../server")
const chai = require("chai")
const chaiHttp = require("chai-http");
const Query = require("../models/queryModel")

chai.should();

chai.use(chaiHttp);

describe('Querry', () => {
    let adminToken
    before((done) => {
        chai.request(app)
          .post('/api/user/admin/login')
          .send({ email: 'nshuti@gmail.com', password: 'password' })
          .end((err, res) => {
            res.body.should.have.property('token').not.null;
            adminToken = res.body.token;
            done();
           }
        );
    });

    after(async () => {
        await Query.deleteMany({});
    });

    describe('POST /api/queries', () => {
        it('should send a new query', (done) => {
            let queryId
            chai.request(app)
            .post(`/api/queries`)
            .send({
                name: "test query",
                email: "query@test.com",
                message:"test query unit test 1"
            })
            .end(async (err, res) => {
                res.should.have.status(201);
                res.body.should.be.an('object');
                res.body.should.have.property('message').eql('Query sent successfuly');
                queryId = res.body.query._id;
                await Query.findById(queryId, (err, query) => {
                    chai.assert.isNull(err);
                    chai.assert.equal(query.name, 'test query');
                    chai.assert.equal(query.email, 'query@test.com');
                    chai.assert.equal(query.message, 'test query unit test 1');
                    done();
                })
            });
        })
    });

    describe("GET /api/queries", () => {
       it("It should GET all the queries", (done) => {
        chai.request(app)
            .get("/api/queries")
            .set('x-access-token', adminToken)
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.an('array');
                done();
            })
       })
    })

})