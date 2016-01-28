/* jshint node: true */
'use strict';

var express = require('express');
var path = require('path');
var app = express();

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

app.get('/new/*', function (req, res) {
  res.json(getShortUrl(req));
});

app.get('/*', function (req, res) {
  res.json(getOriginalUrl(req));
});

module.exports = app;
