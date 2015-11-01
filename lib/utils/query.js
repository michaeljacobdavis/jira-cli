var wreck = require('wreck');
var internals = {};

internals.options = {
  headers: {
    'Authorization': 'Basic ' + process.env.TOKEN,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  rejectUnauthorized: false,
  json: true
};

internals.domain = process.env.DOMAIN;

module.exports = function (query, callback) {
  wreck.get(internals.domain + query, internals.options, callback);
};
