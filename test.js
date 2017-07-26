var request = require('supertest');
var assert = require('assert');

//inside describe block
var server;
beforeEach(function () {
    server = require('./server.js').server;
});

it('should login and return loged in user as JSON', function (done) {
    let username = 'sophia';
    request(server)
        .post('/login')
        .set('username',username)
        .expect(200)
        .end(function (err, response) {
            assert.equal(response.text, '{"id":1}');
            done();
        });
});

it('should return list of users', function (done) {
    request(server)
      .get('/users')
      .expect(200)
        .end(function (err, response) {
            assert.equal(response.text, '[{"id":1}]');
            done();
        });
})

