/* jshint node: true, esversion: 6 */
'use strict';

var server = require('./server');
var port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Listening on port %s', port);
});
