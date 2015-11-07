var colors = require('chalk');

var map = {
  'Work In Progress': colors.green,
  'Backlog': colors.white,
  'Ready for Review': colors.yellow
};

module.exports = function (status) {
  if (status in map) {
    return map[status](status);
  } else {
    return status;
  }
};
