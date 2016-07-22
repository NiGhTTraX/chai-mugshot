/**
 * Chai-Mugshot Plugin
 *
 * @param mugshot - Mugshot instance
 * @param testRunnerCtx - Context of the test runner where the assertions are
 *    done
 */
module.exports = function(mugshot, testRunnerCtx) {
  return function(chai) {
    var Assertion = chai.Assertion;

    function composeMessage(message) {
      var standardMessage = 'expected baseline and screenshot of #{act}';

      return {
        affirmative: standardMessage + ' to ' + message,
        negative: standardMessage + ' to not ' + message
      };
    }

    function mugshotProperty(name, message) {
      var msg = composeMessage(message);

      Assertion.addProperty(name, function() {
        var _this = this,
            captureItem = this._obj,
            promise, resolve, reject;

        promise = new Promise(function(res, rej) {
          resolve = res;
          reject = rej;
        });

        mugshot.test(captureItem, function(error, result) {
          if (error) {
            reject(error);
          } else {
            if (testRunnerCtx !== undefined) {
              testRunnerCtx.result = result;
            }

            try {
              _this.assert(result.isEqual, msg.affirmative, msg.negative);
              resolve();
            } catch (error) {
              reject(error);
            }
          }
        });

        return promise;
      });
    }

    mugshotProperty('identical', 'be identical');
  }
};
