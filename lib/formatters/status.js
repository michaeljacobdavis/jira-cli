var colors = require('colors/safe');

var map = {
  'Work In Progress': colors.bgGreen,
  'Backlog': colors.bgWhite,
  'Ready for Review': colors.bgYellow
};

module.exports = function (status) {
  if (status in map) {
    return map[status](colors.black(' ' + status + ' '));
  } else {
    return status;
  }
};
