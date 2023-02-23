const chai = require("chai")
const chaiHttp = require("chai-http");
const app = require("../server")
const User = require("../models/userModel")

chai.should();

chai.use(chaiHttp);

describe('User', () => {
    let userToken
    let userId
    before((done) => {
        chai.request(app)
          .post('/api/user/client/login')
          .send({ email: 'nshuti@gmail.com', password: 'password' })
          .end((err, res) => {
            console.log(res.body)
            res.body.should.have.property('token').not.null;
            userToken = res.body.token;
            userId = res.body._id
            done();
           }
        );
    });

    // after(async () => {
    //     await User.deleteMany({});
    // });

    describe('POST login', () => {
        it('should log in with valid credentials and return a JWT token', (done) => {
          const user = {
            email:"nshuti@gmail.com",
            password:"password"
          };
          chai
            .request(app)
            .post('/api/user/client/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Login successful');
                res.body.should.have.property('token').not.null;
                done();
            });
        });

        it('should not log in with invalid credentials', (done) => {
            const user = {
            email: 'user@example.com',
            password: 'wrongpassword',
            };
            chai
            .request(app)
            .post('/api/user/client/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Email or password is incorrect');
                done();
            });
        });

        it('should not log in with missing credentials', (done) => {
            const user = {
                email: 'user@example.com',
            };
            chai
            .request(app)
            .post('/api/user/client/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Email and password are required');
                done();
            });
        });
    });

    describe('POST signup', () => {
        it('should register new client user', (done) => {
            const user = {
                first_name: "unitTest",
                last_name: "client",
                email:"clientTest@gmail.com",
                password:"password"
            };
            chai
            .request(app)
            .post('/api/user/client/signup')
            .send(user)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('User added successfully');
                done();
            });
        });
    })

    // describe('PATCH update', () => {
    //     it('should update a client information', (done) => {
    //     const user = new User({ first_name: 'unitTest', last_name: "userUpdate", email: 'unitTest@gmail.com', password: "password" });
    //     user.save((err, savedClient) => {
    //         chai.request(app)
    //         .patch(`/api/user/client/${savedClient._id}`)
    //         .set('x-access-token', userToken)
    //         .send({ last_name: 'userUpdated' })
    //         .end((err, res) => {
    //             res.should.have.status(200);
    //             res.body.should.be.an('object');
    //             // res.body.should.have.property('last_name').eql('userUpdated');
    //             done();
    //         });
    //     });
    //     });
    // });

})