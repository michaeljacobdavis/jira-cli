var bossy = require('bossy');
var table = require('cliff');
var moment = require('moment');
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

  query('/rest/api/2/search?jql=watcher=currentUser() AND  resolution=Unresolved AND updated >= -' + args.time + ' order by updated', function (err, res, payload) {
    if (err) {
      return console.log(err)
    }

    if (payload && Array.isArray(payload.issues)) {
      var columns = ['id', 'status', 'updated', 'assignee', 'summary'];
      var rows = payload.issues.map(function (data) {
        var issue = Issue.parse(data);
        return {
          id: issue.id,
          status: formatters.status(issue.status),
          summary: issue.summary,
          updated: moment(issue.updated).format('l LT'),
          assignee: formatters.highlightCurrentUser(issue.assignee)
        };
      });

      return console.log(table.stringifyObjectRows(rows, columns, columns.map(function () { return 'grey'; })));
    }

    return console.log('No issues were found');
  });
};
