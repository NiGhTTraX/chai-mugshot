var Q = require('q');

module.exports = function(mugshot) {
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
        var captureItem = this._obj;
        var deferred = Q.defer();
        var _this = this;

        mugshot.test(captureItem, function(error, result) {
          if (error) {
            deferred.reject(error);
          } else {
            try {
              _this.assert(result, msg.affirmative, msg.negative);
              deferred.resolve();
            } catch(error) {
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
