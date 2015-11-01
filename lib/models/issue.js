module.exports = function Issue () {};
module.exports.parse = function (issue) {
  return {
    id: issue.key,
    status: issue.fields.status.name,
    summary: issue.fields.summary
  };
};
