var Lab = require('lab');
var Code = require('code');
var Issue = require('../../lib/models/issue');
var lab = exports.lab = Lab.script();

// Alias
var afterEach = lab.afterEach;
var beforeEach = lab.beforeEach;
var describe = lab.describe;
var expect = Code.expect;
var it = lab.it;

describe('Issue', function () {
  describe('::Parse', function () {

    var apiIssue = {
      key: 123,
      fields: {
        status: {
          name: 'Draft'
        },
        assignee: {
          displayName: 'Test'
        },
        summary: 'Blah'
      }
    };

    it('should take in an jira api issue and return an issue instance', function (done) {
      var result = Issue.parse(apiIssue);

      expect(result.id).to.equal(apiIssue.key);
      expect(result.status).to.equal(apiIssue.fields.status.name);
      expect(result.summary).to.equal(apiIssue.fields.summary);
      expect(result.assignee.displayName).to.equal(apiIssue.fields.assignee.displayName);

      done();
    });
  });
});
