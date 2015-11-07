var bossy = require('bossy');
var table = require('cliff');
var Issue = require('../models/issue');
var formatters = require('../formatters');
var query = require('../utils/query');
var internals = {};

internals.definition = {
  t: {
    description: 'Changed since this time. 1m = One Minute, 1d = One Day',
    alias: 'time',
    type: 'string',
    default: '1d'
  },
  h: {
    description: 'Show help',
    alias: 'help',
    type: 'boolean'
  }
};

module.exports = function () {
  var args = bossy.parse(internals.definition);

  // Handle Help
  if (args.h) {
    return console.log(bossy.usage(internals.definition));
  }

  query('/rest/api/2/search?jql=watcher=currentUser() AND  resolution=Unresolved AND updated >= -' + args.time, function (err, res, payload) {
    if (err) {
      return console.log(err)
    }

    if (payload && Array.isArray(payload.issues)) {
      var rows = payload.issues.map(function (issue) {
        return Issue.parse(issue);
      })
      return console.log(table.stringifyObjectRows(rows, ['id', 'status', 'summary'], ['grey', 'grey', 'grey']));
    }

    return console.log('No issues were found');
  });
};
