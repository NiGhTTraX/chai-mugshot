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

    function composeMessage(item, message) {
      var standardMessage = 'expected baseline and screenshot of \'' +
          item.name + '\'';

      if (item.selector) {
        standardMessage = standardMessage + ' (' + item.selector + ')';
      }

      return {
        affirmative: standardMessage + ' to ' + message,
        negative: standardMessage + ' to not ' + message
      };
    }

    function mugshotProperty(name, message) {

      Assertion.addProperty(name, function() {
        var _this = this,
            captureItem = this._obj,
            msg = composeMessage(captureItem, message);

        return new Promise(function(resolve, reject) {
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
        });
      });
    }

    mugshotProperty('identical', 'be identical');
  }
};
