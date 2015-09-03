var chai = require('chai');
var expect = require('chai').expect;
var AssertionError = require('chai').AssertionError;
var chaiAsPromised = require('chai-as-promised');
var chaiMugshot = require('../index.js');
var Mugshot = require('mugshot');
var WdioAdapter = Mugshot.adapters.WebdriverIO;
var wdio = require('webdriverio');
var fs = require('fs');
var path = require('path');

chai.use(chaiAsPromised);

var name = 'great';
var ext = '.png';
var dir = path.join(__dirname, '..', 'visual-tests');

function cleanUp() {
  var paths = [path.join(dir, name + ext), path.join(dir, name + '.new' + ext),
               path.join(dir, name + '.diff' + ext)];

  for (var i = 0; i < paths.length; i++) {
    try {
      fs.unlinkSync(paths[i]);
    } catch(error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  try {
    fs.rmdirSync(dir);
  } catch(error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
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
      withSelector = {
        name: name,
        selector: '#rectangle'
      },
      wdioInstance, mugshot;

  before(function() {
    var options = {
      desiredCapabilities: {
        browserName: 'phantomjs'
      }
    };

    return wdioInstance = wdio.remote(options).init().url(url)
      .then(function() {
        var browser = new WdioAdapter(this);
        mugshot = new Mugshot(browser);

        chai.use(chaiMugshot(mugshot));
      });
  });

  beforeEach(function(done) {
    cleanUp();

    mugshot.test(withSelector, function(error) {
      if (error) {
        throw error;
      }

      done();
    });
  });

  it('should be rejected if mugshot fails', function() {
    return expect(expect(brokenSelector).to.be.identical).to.be
      .rejectedWith(Error);
  });

  it('should not throw if there is no previous baseline', function() {
    fs.unlinkSync(path.join(dir, name + ext));

    return expect(expect(withSelector).to.be.identical).to.be.fulfilled;
  });

  it('should not throw if there are no differences', function() {
    return expect(expect(withSelector).to.be.identical).to.be.fulfilled;
  });

  it('should throw error if there are differences', function() {
    return expect(expect(withSelector).to.not.be.identical).to.be
      .rejectedWith(AssertionError);
  });

  it('should not throw if there are differences', function() {
    return expect(expect(noSelector).to.not.be.identical).to.be.fulfilled;
  });

  it('should throw if there are no differences', function() {
    return expect(expect(noSelector).to.be.identical).to.be
      .rejectedWith(AssertionError);
  });

  describe('Test Runner Context', function() {
    var testRunnerCtx = {};

    before(function() {
      chai.use(chaiMugshot(mugshot, testRunnerCtx));
    });

    it('should put the result on the provided object', function() {
      return expect(withSelector).to.be.identical.then(function() {
        expect(testRunnerCtx).to.have.ownProperty('result');
      });
    });
  });

  after(function() {
    cleanUp();
    return wdioInstance.end();
  });
});
