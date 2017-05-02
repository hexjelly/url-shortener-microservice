const env = process.env.NODE_ENV || 'production'
const config = require('../config')
const express = require('express')
const path = require('path')
const mongo = require('mongodb').MongoClient
let app = express()
let db

mongo.connect(config[env].db, (err, mdb) => {
  if (!err) {
    db = mdb
  }
})

function getShortUrl (url) {
  if (/https?\:\/\/\S+\.\S+/i.test(url)) {

    let shortUrl = ''
    return { originalURL: url, shortURL: shortUrl }
  } else {
    return { error: 'Invalid URL' }
  }
}

function getOriginalUrl (id) {


  let result = { id: id }
  return result
}

function getNextSequence (collectionName) {
  if (!db.getCollection(collectionName).exists()) {
    db.collection(collectionName).insertOne({ _id: 'counter', seq: 0 })
  }

  let ret = db.collection(collectionName).findOneAndUpdate(
    { _id: 'counter' }, { $inc: { seq: 1 } }, { returnNewDocument: true }
   )

  return ret.seq
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/index.html'))
})

app.get('/new', (req, res) => {
  res.json({ error: 'No URL provided' })
})

app.get('/new/:url', (req, res) => {
  res.json(getShortUrl(req.params.url))
})

app.get('/:id', (req, res) => {
  let url = getOriginalUrl(req.params.id)
  if (url) res.redirect(301, url)
  else res.sendStatus(404)
})

module.exports = app
