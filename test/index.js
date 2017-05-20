const env = process.env.NODE_ENV = 'test'
const config = require('../config')

const request = require('supertest')
const rewire = require('rewire')
const assert = require('assert')
const mongo = require('mongodb').MongoClient
const execSync = require('child_process').execSync;

let server

// route responses
describe('Routes', () => {
  before(() => {
    // reset test database
    mongo.connect(config[env].db, (err, db) => {
      if (err) return console.log(err)
      db.collection("urls").drop((err, reply) => {

      })
      db.collection("counter").drop((err, reply) => {
        
      })
    })

    // wait for any potential db sync issues etc.
    execSync("sleep 1")

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

  it('/new/https://google.com responds with short URL', done => {
    request(server)
      .get('/new/https://google.com')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done)
  })

  it('/1 gives 307', done => {
    request(server)
      .get('/1')
      .expect(307, done)
  })

  it('/2 gives 200 and error message', done => {
    request(server)
      .get('/2')
      .expect(200, done)
  })
})

describe('isValidUrl', () => {
  let server
  let isValidUrl

  before(() => {
    server = rewire('../server')
    isValidUrl = server.__get__('isValidUrl')
  })

  it('Detects basic URL syntax', () => {
    assert.equal(true, isValidUrl("https://google.com"))
    assert.equal(true, isValidUrl("http://google.com"))
    assert.equal(false, isValidUrl("https://google"))
    assert.equal(false, isValidUrl("http://google,com"))
  })
})
