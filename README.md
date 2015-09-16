# Chai-Mugshot [![Build Status](https://travis-ci.org/uberVU/chai-mugshot.svg?branch=master)](https://travis-ci.org/uberVU/chai-mugshot)

[Chai](http://chaijs.com/) plugin for the [Mugshot](https://github.com/uberVU/mugshot) Visual regression testing lib.


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
  var webdriverioInstance;

  before(function(done) {
    var options = {
      desiredCapabilities: {
        browserName: 'firefox'
      }
    };

    webdriverioInstance = webdriverio.remote(options).init()
      .url('http://example.com')
      .then(function() {
      
        var browser = new WebdriverIOAdapter(webdriverioInstance);
        var mugshot = new Mugshot(browser);
        
        chai.use(chaiMugshot(mugshot));
        
        done();
      });
  });

  it('should always look the same', function() {
    var captureItem = {
      name: 'myComponent',
      selector: '#myComponent'
    };
    
    return expect(captureItem).to.be.identical;
  });
  
  it('should always differ', function() {
  // see https://github.com/uberVU/mugshot#methods for details
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


## API

For the plugin to function, you must pass a `Mugshot` instance as in the example provided above.


### Properties

The assertion properties return a `promise` that tells [Mocha](http://mochajs.org/) or `other test runners`, that the test is `async`.

- **identical** - asserts that the `baseline` on disk of the `capturItem` is identical to the current `screenshot`
