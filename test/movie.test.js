
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const Movie = require('../models/movie');

chai.use(chaiHttp);

before((done) => {
    Movie.deleteMany({}, function(err) {});
    done();
});

after((done) => {
    Movie.deleteMany({}, function(err) {});
    done();
});

describe('/First Test Collection', () => {

    it('test default API welcome route...', (done) => {

        chai.request(server)
        .get('/api/welcome')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');    
            const actualVal = res.body.message;
            expect(actualVal).to.be.equal('Welcome to the MEN-REST-API');        
            done();
        });
    });

    it('should verify that we have 0 movies in the DB', (done) => {
        chai.request(server)
        .get('/api/movies')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            done();
        });
    });

    it('should POST a valid movie', (done) => {
        
        let movie = {
            title: "Test movie",
            genre: "Test movie genre",
            storyline: "Test movie storyline",
            rate: 9.2,
            year: 1986
        }
        chai.request(server)
        .post('/api/movies')
        .send(movie)
        .end((err, res) => {
            res.should.have.status(201);
            done();
        });
    });

it('should verify that we have 1 movies in the DB', (done) => {
    chai.request(server)
    .get('/api/movies')
    .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(1);
        done();
    });
});

it('should test two values....', () => {
    //actual test content in here
    let expectedVal = 10;
    let actualVal = 10;

    expect(actualVal).to.be.equal(expectedVal);
})
})