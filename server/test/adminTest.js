const app = require("../server")
const chai = require("chai")
const chaiHttp = require("chai-http");
const Admin = require("../models/adminModel")
const User = require("../models/userModel")

chai.should();

chai.use(chaiHttp);

describe('Admin', () => {
    let adminToken
    before(async (done) => {
        this.timeout(10000)
        try {
            const res = await chai.request(app)
            .post('/api/user/admin/login')
            .send({ email: 'nshuti@gmail.com', password: 'password' })
            
            res.body.should.have.property('token').not.null;
            adminToken = res.body.token;
            done()
        } catch (error){
            console.log(error)
        }
    });

    describe('POST login', () => {
        it('should log in with valid credentials and return a JWT token', (done) => {
            const user = {
                email:"nshuti@gmail.com",
                password:"password"
            };
            chai
            .request(app)
            .post('/api/user/admin/login')
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
            .post('/api/user/admin/login')
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
            .post('/api/user/admin/login')
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
        it('should register new admin user', async () => {
            // const user = {
            //     first_name: "unitTest",
            //     last_name: "adminSignup",
            //     email:"adminTest@gmail.com",
            //     password:"password"
            // };
            // chai
            // .request(app)
            // .post('/api/user/admin/signup')
            // .send(user)
            // .end((err, res) => {
            //     res.should.have.status(201);
            //     res.body.should.be.a('object');
            //     res.body.should.have.property('message').eql('Admin added successfully');
            //     done();
            // });

            const res = await chai.request(app)
            .post('/api/user/admin/signup')
            .send({
                first_name: "unitTest",
                last_name: "admin",
                email: "adminTest@gmail.com",
                password: "password"
            })

            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Admin added successfully');
        });
    })

    describe('PATCH update', () => {
        it('should update an admin information', (done) => {
        const admin = new Admin({ first_name: 'unitTest', last_name: "adminUpdate", email: 'unitTest@gmail.com', password: "password" });
        admin.save(async (err, savedAdmin) => {
            await chai.request(app)
            .patch(`/api/user/admin/${savedAdmin._id}`)
            .set('x-access-token', adminToken)
            .send({ last_name: 'adminUpdated' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('message').eql('Admin information updated successfully');
                done();
            });
        });
        });
    });

    describe('GET admins', () => {
        it('should get all admin users', (done) => {
            chai.request(app)
            .get('/api/user/admin')
            .set('x-access-token', adminToken)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array');
                done();
            });
        });
    });

    describe('DELETE admin', () => {
        it('should delete an admin user', (done) => {
        const admin = new Admin({ first_name: 'unitTest', last_name: "adminDelete", email: 'unitTest@gmail.com', password: "password" });
        admin.save((err, savedAdmin) => {
            chai.request(app)
            .delete(`/api/user/admin/${savedAdmin._id}`)
            .set('x-access-token', adminToken)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('message').eql('Admin user deleted successfully');
                Admin.findById(admin.id, (err, admin) => {
                  chai.assert.isNull(err);
                  chai.assert.isNull(admin);
                  done();
                });
            });
        });
        });
    });

    describe('GET users', () => {
        it('should get all client users', (done) => {
            chai.request(app)
            .get('/api/user/client')
            .set('x-access-token', adminToken)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array');
                done();
            });
        });
    });

    describe('DELETE user', () => {
        it('should delete a client user', (done) => {
        const user = new User({ first_name: 'unitTest', last_name: "userDelete", email: 'unitTest@gmail.com', password: "password" });
        user.save(async (err, savedClient) => {
            await chai.request(app)
            .delete(`/api/user/client/${savedClient._id}`)
            .set('x-access-token', adminToken)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('message').eql('User deleted successfully');
                User.findById(user.id, (err, user) => {
                  chai.assert.isNull(err);
                  chai.assert.isNull(user);
                  done();
                });
            });
        });
        });
    });

    after(async () => {
        await Admin.deleteMany({first_name: "unitTest"});
    });

})
