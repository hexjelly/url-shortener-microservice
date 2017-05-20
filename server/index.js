const env = process.env.NODE_ENV || 'production'
const config = require('../config')
const express = require('express')
const path = require('path')
const mongo = require('mongodb').MongoClient
let app = express()
let db

mongo.connect(config[env].db, (err, mdb) => {
  if (err) return console.log(err)

  db = mdb
  // create collections if it doesn't exist
  db.createCollection("urls", {}, (err, collection) => {
    if (err) return console.log(err)
  })
  db.createCollection("counter", {}, (err, collection) => {
    if (err) return console.log(err)
  })
})

// very simple and naive url checking
function isValidUrl (url) {
  return /https?\:\/\/\S+\.\S+/i.test(url)
}

function getShortUrl (url, callback) {
  if (isValidUrl(url)) {
    getNextSequence(url, callback)
  } else {
    callback(null, { error: 'Invalid URL', context: url })
  }
}

function getOriginalUrl (id, callback) {
  if (!db) {
    callback({ error: "No database connection" })
  }
  else {
    db.collection("urls").findOne({ shortUrl: parseInt(id) }, { fields: { originalUrl: 1 } }, (err, doc) => {
      if (err) callback(err)
      else if (!doc) {
        callback(null, { error: "Short URL not found" })
      }
      else callback(null, doc.originalUrl)
    })
  }
}

function getNextSequence (url, callback) {
  if (!db) {
    callback(null, { error: "No database connection" })
  }

  else {
    // check if original url exists already
    db.collection("urls").findOne({ originalUrl: url }, { fields: { shortUrl: 1 } }, (err, doc) => {
      if (err) callback(err)
      else {
        // url does not exist
        if (!doc) {
          // update counter
          db.collection("counter").findOneAndUpdate({ _id: "urlCounter" }, { $inc: { seq: 1 } }, { upsert: true, w: 1, returnOriginal: false }, (err, counterDoc) => {
            if (err) callback(err)
            // insert new url
            else {
              db.collection("urls").insertOne({ originalUrl: url, shortUrl: counterDoc.value.seq }, (err, shortDoc) => {
                if (err) callback(err)
                else {
                  callback(null, counterDoc.value.seq)
                }
              })
            }
          })
        }

        else {
          // return shorturl
          callback(null, doc.shortUrl)
        }
      }
    })
  }
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/index.html'))
})

app.get('/new', (req, res) => {
  res.json({ error: 'No URL provided' })
})

app.get('/new/:url(*)', (req, res) => {
  getShortUrl(req.params.url, (err, result) => {
    if (err) console.log(err)
    else {
      let selfUrl = `${req.protocol}://${req.get("host")}/${result}`
      res.json({ originalUrl: req.params.url, shortUrl: selfUrl })
    }
  })
})

app.get('/:id', (req, res) => {
  getOriginalUrl(req.params.id, (err, url) => {
    if (err) console.log(err)
    else if (url.error) res.json(url)
    else res.redirect(307, url)
  })
})

module.exports = app
