var Q = require('q');

module.exports = function(mugshot) {
  return function(chai, utils) {
    var Assertion = chai.Assertion;

    function composeMessage(message) {
      var standardMessage = 'expected baseline and screenshot';

      return {
        affirmative: standardMessage + ' to ' + message,
        negative: standardMessage + ' to not ' + message
      };
    }

    function mugshotProperty(name, message) {
      var msg = composeMessage(message);
      var _this = this;

      Assertion.addProperty(name, function() {
        var captureItem = this._obj;
        var deferred = Q.defer();
        var _this = this;

        mugshot.test(captureItem, function(error, result) {
          if (error) {
            deferred.reject(error);
          } else {
            deferred.resolve(
              _this.assert(result, msg.affirmative, msg.negative));
          }
        });

        return deferred.promise;
      });
    }

    mugshotProperty('identical', 'be identical');
  }
};
