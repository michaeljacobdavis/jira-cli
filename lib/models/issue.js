var Issue = function () {};

Issue.parse = function (issue) {
  return {
    assignee: issue.fields.assignee,
    id: issue.key,
    status: issue.fields.status.name,
    summary: issue.fields.summary,
    updated: issue.fields.updated
  };
};

module.exports = Issue;
