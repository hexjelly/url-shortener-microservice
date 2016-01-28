var request = require('supertest');
var rewire = require('rewire');
var assert = require('assert');
var server;

// route responses
describe('Routes', function () {
  before(function () {
    server = require('../server').listen(4000);
  });

  after(function () {
    server.close();
  });

  it('/ responds with html', function (done) {
    request(server)
      .get('/')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });

  it('/new responds with json', function (done) {
    request(server)
      .get('/new')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('/new/* responds with json', function (done) {
    request(server)
      .get('/new/abcdef')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('/a gives 301', function (done) {
    request(server)
      .get('/a')
      .expect(301, done);
  });

  it('/b gives 404', function (done) {
    request(server)
      .get('/b')
      .expect(404, done);
  });
});

describe('getShortUrl', function () {
  before(function () {
    var server = rewire('../server');
    getShortUrl = server.__get__('getShortUrl');
  });

  it('Gives correct results, test case #1');
});

describe('getOriginalUrl', function () {
  before(function () {
    var server = rewire('../server');
    getShortUrl = server.__get__('getOriginalUrl');
  });

  it('Gives correct results, test case #1');
});
