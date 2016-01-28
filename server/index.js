/* jshint node: true */
'use strict';

var config = require('../config');
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var app = express();

//app.set('dbUrl', config.db[app.settings.env]);
//mongoose.connect(app.get('dbUrl'));

function getShortUrl (req) {
  var result = { };
  return result;
}

function getOriginalUrl (req) {
  var result = { };
  return result;
}


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

app.get('/new/:url', function (req, res) {
  res.json(getShortUrl(req.params.url));
});

app.get('/:id', function (req, res) {
  var url = getOriginalUrl(req.params.id);
  res.redirect(301, 'http://example.com');
});

module.exports = app;
