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
  a: {
    description: 'List all issues',
    alias: 'all',
    type: 'boolean',
    default: false
  },
  h: {
    description: 'Show help',
    alias: 'help',
    type: 'boolean'
  }
};

internals.filters = {
  watchedByCurrentUser: 'watcher=currentUser()',
  openIssues: 'resolution=Unresolved'
};

internals.sort = {
  updated: 'order by updated'
};

module.exports = function () {
  var args = bossy.parse(internals.definition);
  var filters = [internals.filters.watchedByCurrentUser, internals.filters.openIssues];
  debugger;

  // Handle Help
  if (args.h) {
    return console.log(bossy.usage(internals.definition));
  }

  // Limit by time
  if (!args.a) {
    filters.push('updated >= -' + args.time);
  }

  query('/rest/api/2/search?jql=' + [filters.join(' AND '), internals.sort.updated].join(' '), function (err, res, payload) {
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
