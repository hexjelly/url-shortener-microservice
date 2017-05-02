process.env.NODE_ENV = 'test'

const request = require('supertest')
const rewire = require('rewire')
const assert = require('assert')
let server

// route responses
describe('Routes', () => {
  before(() => {
    server = require('../server').listen(4000)
  })

  after(() => {
    server.close()
  })

  it('/ responds with html', done => {
    request(server)
      .get('/')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect(200, done)
  })

  it('/new responds with json', done => {
    request(server)
      .get('/new')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done)
  })

  it('/new/* responds with json', done => {
    request(server)
      .get('/new/abcdef')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done)
  })

  it('/a gives 301', done => {
    request(server)
      .get('/a')
      .expect(301, done)
  })

  it('/b gives 404', done => {
    request(server)
      .get('/b')
      .expect(404, done)
  })
})

describe('getShortUrl', () => {
  before(() => {
    let server = rewire('../server')
    getShortUrl = server.__get__('getShortUrl')
  })

  it('Gives correct results, test case #1')
})

describe('getOriginalUrl', () => {
  before(() => {
    var server = rewire('../server')
    getShortUrl = server.__get__('getOriginalUrl')
  })

  it('Gives correct results, test case #1')
})
