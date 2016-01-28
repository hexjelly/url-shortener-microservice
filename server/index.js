/* jshint node: true, esversion: 6 */
'use strict';

var env = process.env.NODE_ENV;
var config = require('../config');
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var app = express();

//app.set('dbUrl', config.db[app.settings.env]);
//mongoose.connect(app.get('dbUrl'));

function getShortUrl (url) {
  var result = { url: url };
  return result;
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
