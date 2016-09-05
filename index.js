var Q = require('q');

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

        var captureItem = this._obj;
        var deferred = Q.defer();
        var _this = this;
        var msg = composeMessage(captureItem, message);

        mugshot.test(captureItem, function(error, result) {
          if (error) {
            deferred.reject(error);
          } else {
            if (testRunnerCtx !== undefined) {
              testRunnerCtx.result = result;
            }

            try {
              _this.assert(result.isEqual, msg.affirmative, msg.negative);
              deferred.resolve();
            } catch (error) {
              deferred.reject(error);
            }
          }
        });

        return deferred.promise;
      });
    }

    mugshotProperty('identical', 'be identical');
  }
};
