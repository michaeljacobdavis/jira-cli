var keychain = require('keychain');
var readlineSync = require('readline-sync');
var config = require('rc')('jira');
var internals = {};

exports.set = function (options, callback) {
  keychain.setPassword(options, callback);
};

exports.get = function (callback) {
  var options = {
    type: 'internet'
  };

  if (!config.service) {
    options.service = readlineSync.question('Jira Hostname:');
  } else {
    options.service = config.service;
  }

  if (!config.account) {
    options.account = readlineSync.question('Username:');
  } else {
    options.account = config.account;
  }

  keychain.getPassword(options, function(error, password) {
    if (error) {
      options.password = readlineSync.question('Password:', {
        hideEchoBack: true
      });

      return callback(error, options);
    }

    options.password = password;
    return callback(error, options);
  });
};
