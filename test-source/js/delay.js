define(
	/**
	 * @exports js/delay
	 * Assume theres some injection in the test and we use AMD.
	 */
	function() {
	    /**
	     * @alias module:js/delay
	     * @param {Number} milliseconds
	     * @param {Object} scope
	     * @param {String} methodName
	     * @param {Array<?>} args
	     * @return {Promise} Resolves to method scope[methodName](args) result.
	     */
	    var delay = function(milliseconds, scope, methodName, args) {
		var thePromise = new Promise(function(resolve, reject) {
		    setTimeout(function() {
			try {
			    var method = scope[methodName];
			    var result = method.apply(scope, args);
			    resolve(result);
			} catch (error) {
			    error.scope = scope;
			    error.methodName = methodName;
			    error.args = args;
			    reject(error);
			}
		    }, milliseconds);
		});
		return thePromise;
	    };
	    return delay;
	});