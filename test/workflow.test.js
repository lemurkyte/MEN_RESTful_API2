const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');
chai.use(chaiHttp);

describe('User workflow tests', () => {

    it('should register + login a user, create movie and verify 1 in DB', (done) => {

        // 1) Register new user
        let user = {
            name: "Peter Petersen",
            email: "mail@petersen.com",
            password: "12345678912"
        }
        chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {
                
                // Asserts
                expect(res.status).to.be.equal(200);   
                expect(res.body).to.be.a('object');
                expect(res.body.error).to.be.equal(null);
               
                // 2) Login the user
                chai.request(server)
                    .post('/api/user/login')
                    .send({
                        "email": "mail@petersen.com",
                        "password": "12345678912"
                    })
                    .end((err, res) => {
                        // Asserts                        
                        expect(res.status).to.be.equal(200);   
                        expect(res.body.error).to.be.equal(null);                        
                        let token = res.body.data.token;

                        // 3) Create new movie
                        let movie =
                        {
                            title: "Test Movie",
                            genre: "Test Movie genre",
                            storyline: "Test Movie Storyline",
                            rate: 9.2,
                            year: 1986
                        };

                        chai.request(server)
                            .post('/api/movies')
                            .set({ "auth-token": token })
                            .send(movie)
                            .end((err, res) => {
                                
                                // Asserts
                                expect(res.status).to.be.equal(201);                                
                                expect(res.body).to.be.a('array');
                                expect(res.body.length).to.be.eql(1);
                                
                                let savedMovie = res.body[0];
                                expect(savedMovie.title).to.be.equal(movie.title);
                                expect(savedMovie.genre).to.be.equal(movie.genre);
                                expect(savedMovie.storyline).to.be.equal(movie.storyline);
                                expect(savedMovie.rate).to.be.equal(movie.rate);
                                expect(savedMovie.year).to.be.equal(movie.year);


                                // 4) Verify one movie in test DB
                                chai.request(server)
                                    .get('/api/movies')
                                    .end((err, res) => {
                                        
                                        // Asserts
                                        expect(res.status).to.be.equal(200);                                
                                        expect(res.body).to.be.a('array');                                
                                        expect(res.body.length).to.be.eql(1);
                                
                                        done();
                                    });
                            });
                    });
            });
    });

    it('should register + login a user, create movie and delete it from DB', (done) => {

        // 1) Register new user
        let user = {
            name: "Peter Petersen",
            email: "mail@petersen.com",
            password: "12345678912"
        }
        chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {
                
                // Asserts
                expect(res.status).to.be.equal(200);   
                expect(res.body).to.be.a('object');
                expect(res.body.error).to.be.equal(null);
                
                // 2) Login the user
                chai.request(server)
                    .post('/api/user/login')
                    .send({
                        "email": "mail@petersen.com",
                        "password": "12345678912"
                    })
                    .end((err, res) => {
                        // Asserts                        
                        expect(res.status).to.be.equal(200);                         
                        expect(res.body.error).to.be.equal(null);                        
                        let token = res.body.data.token;

                        // 3) Create new movie
                        let movie =
                        {
                            title: "Test Movie",
                            genre: "Test Movie genre",
                            storyline: "Test Movie Storyline",
                            rate: 9.2,
                            year: 1986
                        };

                        chai.request(server)
                            .post('/api/movies')
                            .set({ "auth-token": token })
                            .send(movie)
                            .end((err, res) => {
                                
                                // Asserts
                                expect(res.status).to.be.equal(201);                                
                                expect(res.body).to.be.a('array');
                                expect(res.body.length).to.be.eql(1);
                                
                                let savedMovie = res.body[0];
                                expect(savedMovie.title).to.be.equal(movie.title);
                                expect(savedMovie.genre).to.be.equal(movie.genre);
                                expect(savedMovie.storyline).to.be.equal(movie.storyline);
                                expect(savedMovie.rate).to.be.equal(movie.rate);
                                expect(savedMovie.year).to.be.equal(movie.year);


                                // 4) Delete movie
                                chai.request(server)
                                    .delete('/api/movies/' + savedMovie._id)
                                    .set({ "auth-token": token })
                                    .end((err, res) => {
                                        
                                        // Asserts
                                        expect(res.status).to.be.equal(200);                                        
                                        const actualVal = res.body.message;
                                        expect(actualVal).to.be.equal('Movie was deleted successfully!');        
                                        done();
                                    });
                            });
                    });
            });
    });

    it('should register user with invalid input', (done) => {

        // 1) Register new user with invalid inputs
        let user = {
            name: "Peter Petersen",
            email: "mail@petersen.com",
            password: "123" //Faulty password - Joi/validation should catch this...
        }
        chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {
                                
                // Asserts
                expect(res.status).to.be.equal(400); //normal expect with no custom output message
                //expect(res.status,"Status is not 400 (NOT FOUND)").to.be.equal(400); //custom output message at fail
                
                expect(res.body).to.be.a('object');
                expect(res.body.error).to.be.equal("\"password\" length must be at least 6 characters long");  
                done();              
            });
    });
});