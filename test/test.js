var chai = require('chai');
var expect = require('chai').expect;
var Mugshot = require('mugshot');
var chaiMugshot = require('../index.js');
var wdioAdapter = Mugshot.adapters.WebdriverIO;
var wdio = require('webdriverio');
var fs = require('fs');
var path = require('path');

var name = 'great';

function cleanUp() {
  var ext = '.png';
  var dir  = path.join(__dirname, '../visual-tests');

  fs.unlink(path.join(dir, name + ext), function() {});
  fs.unlink(path.join(dir, name + '.new' + ext), function() {});
  fs.unlink(path.join(dir, name + '.diff' + ext), function() {});

  fs.rmdirSync(dir);
}

describe('Chai-Mugshot Plugin', function() {
  this.timeout(0);

  var url = 'file://' + path.join(__dirname, 'test.htm'),
      noSelector = {
        name: name
      },
      withSelector  = {
        name: name,
        selector: '#rectangle'
      },
      wdioInstance;

  before(function() {
    var options = {
      desiredCapabilities: {
        browserName: 'phantomjs'
      }
    };

    return wdioInstance = wdio.remote(options).init().url(url)
      .then(function() {
        var browser = new wdioAdapter(this);
        var mugshot = new Mugshot(browser);

        chai.use(chaiMugshot(mugshot));
      });
  });

  it('should be identical if there is no previous baseline', function() {
    return expect(withSelector).to.be.identical;
  });

  it('should be identical if there are no differences', function() {
    return expect(withSelector).to.be.identical;
  });

  it('should not be identical if there are differences', function() {
    return expect(noSelector).to.not.be.identical;
  });

  after(function() {
    cleanUp();
    return wdioInstance.end();
  });
});
