var colors = require('chalk');
var config = require('../utils/config');

module.exports = function (user) {
  if (!user) return '';

  if (user.name === config.account) {
    return colors.blue(user.displayName);
  }
  
  return user.displayName;
};
