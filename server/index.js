/* jshint node: true, esversion: 6 */
'use strict';

var env = process.env.NODE_ENV || 'production';
var config = require('../config');
var express = require('express');
var path = require('path');
var mongo = require('mongodb').MongoClient;
var app = express();


function getShortUrl (url) {
  if (/https?\:\/\/\S+\.\S+/i.test(url)) {
    return { originalURL: url, shortURL: shortUrl };
  } else {
    return { error: 'Invalid URL' };
  }
  /*
  mongo.connect(config[env].db, (err, db) => {
    if (!err) {
      db.collection('restaurants').insertOne({ "address": 17 }, (err, result) => {
        if (!err) {
          console.log("Inserted a document into the restaurants collection.");
        }
      });
      db.close();
    }
  });
  */
}

function getOriginalUrl (id) {


  var result = { id: id };
  return result;
}


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

app.get('/new/:url', (req, res) => {
  res.json(getShortUrl(req.params.url));
});

app.get('/:id', (req, res) => {
  var url = getOriginalUrl(req.params.id);
  res.redirect(301, url);
});

module.exports = app;
