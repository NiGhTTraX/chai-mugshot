# Chai-Mugshot

Chai plugin for the Mugshot regression lib.

This plugin helps you to `assert` better with [Chai](http://chaijs.com/) and [Mugshot](https://github.com/uberVU/mugshot). It 
returns a `resolved` or a `rejected` promise (Promises/A+).

## Install

```sh
npm install --save-dev chai-mugshot
```

## Usage

```js
var chai = require('chai');
var expect = require('chai').expect;
var chaiMugshot = require('chai-mugshot');
var Mugshot = require('mugshot');
var WebdriverIOAdapter = Mugshot.adapters.WebdriverIO;
var webdriverio = require('webdriverio');

describe('Suite', function() {
  var mugshot, webdriverioInstance;

  before(function(done) {
    var options = {
      desiredCapabilities: {
        browserName: 'firefox'
      }
    };

    webdriverioInstance = webdriverio.remote(options).init()
      .url('http://example.com')
      .then(function() {
      
        var browser = new WebdriverIOAdaptor(webdriverioInstance);
        var mugshot = new Mugshot(browser);
        
        // Instructing Chai to use the plugin and passing to the Chai-Mugshot plugin a Mugshot instance
        chai.use(chaiMugshot(mugshot));

        done();
      });
  });

  it('should be the same component', function() {
    var captureItem = {
      name: 'myComponent',
      selector: '#myComponent'
    };
    
    return expect(captureItem).to.be.identical;
  });
  
  it('should always differ'. function() {
    var captureItem = {
      name: 'component',
      selector: '#component'
    };
    
    return expect(captureItem).to.not.be.identical;
  });

  after(function() {
    return webdriverio.end();
  });
});
```

## Api

### Properties

- **identical** - asserts that the `baseline` on disk of the `capturItem` is identical to the current `screenshot`
