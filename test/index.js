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

  it('/1 gives 301', done => {
    request(server)
      .get('/1')
      .expect(301, done)
  })

  it('/2 gives 404', done => {
    request(server)
      .get('/2')
      .expect(404, done)
  })
})

describe('getShortUrl', () => {
  let server
  let isValidUrl

  before(() => {
    server = rewire('../server')
    isValidUrl = server.__get__('isValidUrl')
  })

  it('Gives correct results', () => {
    assert.equal(true, isValidUrl("https://google.com"))
    assert.equal(true, isValidUrl("http://google.com"))
  })

  it('Gives error for invalid URLs', () => {
    assert.equal(false, isValidUrl("https://google"))
    assert.equal(false, isValidUrl("http://google,com"))
  })
})

describe('getOriginalUrl', () => {
  let server
  let originalURL

  before(() => {
    server = rewire('../server')
    getOriginalUrl = server.__get__('getOriginalUrl')
  })

  it('Gives correct results, test case #1')
})
