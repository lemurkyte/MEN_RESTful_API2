process.env.NODE_ENV = 'test';

const Movie = require('../models/movie');
const User = require('../models/user');

//clean up the database before and after each test
beforeEach((done) => { 
    Movie.deleteMany({}, function(err) {});
    User.deleteMany({}, function(err) {});
    done();
});

afterEach((done) => {
    User.deleteMany({}, function(err) {});
    Movie.deleteMany({}, function(err) {});
    done();
});