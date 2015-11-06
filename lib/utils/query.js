var wreck = require('wreck');
var auth = require('./auth');
var internals = {};

internals.generateOptions = function (options) {
  return {
    headers: {
      'Authorization': 'Basic ' + new Buffer(options.account + ':' + options.password).toString('base64'),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    rejectUnauthorized: false,
    json: true
  };
};

internals.isClientError = /^4/;

module.exports = function (query, callback) {
  auth.get(function (error, options) {
    wreck.get('https://' + options.service + query, internals.generateOptions(options), function (error, res, payload) {
      if (internals.isClientError.test(String(res.statusCode))) {
        return callback('Unauthorized. Please try again.', res, payload);
      }

      if (!error) {
        auth.set(options, function (error) {
          if (error) {
            console.log('Error saving to keychain:', error);
          }
        });
      }

      callback.apply(null, arguments);
    });
  });
};
