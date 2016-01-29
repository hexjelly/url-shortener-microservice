/* jshint node: true, esversion: 6 */
'use strict';

var env = process.env.NODE_ENV || 'production';
var config = require('../config');
var express = require('express');
var path = require('path');
var mongo = require('mongodb').MongoClient;
var app = express();
var db;

mongo.connect(config[env].db, (err, mdb) => {
  if (!err) {
    db = mdb;
  }
});

function getShortUrl (url) {
  if (/https?\:\/\/\S+\.\S+/i.test(url)) {

    var shortUrl = '';
    return { originalURL: url, shortURL: shortUrl };
  } else {
    return { error: 'Invalid URL' };
  }
}

function getOriginalUrl (id) {


  var result = { id: id };
  return result;
}

function getNextSequence (collectionName) {
  if (!db.getCollection(collectionName).exists()) {
    db.collection(collectionName).insertOne({ _id: 'counter', seq: 0 });
  }

  var ret = db.collection(collectionName).findOneAndUpdate(
    { _id: 'counter' }, { $inc: { seq: 1 } }, { returnNewDocument: true }
   );

  return ret.seq;
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

app.get('/new', (req, res) => {
  res.json({ error: 'No URL provided' });
});

app.get('/new/:url', (req, res) => {
  res.json(getShortUrl(req.params.url));
});

app.get('/:id', (req, res) => {
  var url = getOriginalUrl(req.params.id);
  if (url) res.redirect(301, url);
  else res.sendStatus(404);
});

module.exports = app;
