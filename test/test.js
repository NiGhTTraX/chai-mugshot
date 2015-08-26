var chai = require('chai');
var expect = require('chai').expect;
var AssertionError = require('chai').AssertionError;
var chaiAsPromised = require('chai-as-promised');
var chaiMugshot = require('../index.js');
var Mugshot = require('mugshot');
var wdioAdapter = Mugshot.adapters.WebdriverIO;
var wdio = require('webdriverio');
var fs = require('fs');
var path = require('path');

chai.use(chaiAsPromised);

var name = 'great';

function cleanUp() {
  var ext = '.png';
  var dir  = path.join(__dirname, '..', 'visual-tests');

  fs.unlink(path.join(dir, name + ext), function() {});
  fs.unlink(path.join(dir, name + '.new' + ext), function() {});
  fs.unlink(path.join(dir, name + '.diff' + ext), function() {});

  fs.rmdir(dir, function() {});
}

describe('Chai-Mugshot Plugin', function() {
  this.timeout(0);

  var url = 'file://' + path.join(__dirname, 'test.html'),
      brokenSelector = {
        name: name,
        selector: 'anything'
      },
      noSelector = {
        name: name
      },
      withSelector  = {
        name: name,
        selector: '#greenRectangle'
      },
      fulfilledThrowingProm = {
        state: 'pending'
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

  it('should be rejected if mugshot fails', function() {
    return expect(expect(brokenSelector).to.be.identical).to.be
      .rejectedWith(Error);
  });

  it('should not throw if there is no previous baseline', function() {
    return expect(expect(withSelector).to.be.identical).to.be.fulfilled;
  });

  it('should not throw if there is expected to be equal', function() {
    return expect(expect(withSelector).to.be.identical).to.be.fulfilled;
  });

  it('should throw error if there is expected to not be equal', function() {
    return expect(expect(withSelector).to.not.be.identical).to.be
      .rejectedWith(AssertionError);
  });

  it('should not throw if there is expected to have differences', function() {
    return expect(expect(noSelector).to.not.be.identical).to.be.fulfilled;
  });

  it('should throw if there is not expected to have differences', function() {
    return expect(expect(noSelector).to.be.identical).to.be
      .rejectedWith(AssertionError);
  });

  after(function() {
    cleanUp();
    return wdioInstance.end();
  });
});
