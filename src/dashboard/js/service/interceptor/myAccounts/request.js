define(function(require) {

	return function(LocationAPI, statusCodeMapper, storeSettings) {

	    var	locationAPI = new LocationAPI(),
	    	requestHeader = require('dashboard/service/requestHeader');

	    return {
			before: function( settings ){
	            var header = requestHeader.getHeader();

	            if (Object.keys(header).length) {
	                settings.beforeSend = function(xhr) {
	                   for ( var key in header) {
	                    	xhr.setRequestHeader(key, header[key]);
	                   }
	                };
	            }

	            storeSettings.set('authRedirectURL', locationAPI.getLocationURL(), storeSettings.Type.USER);

				return settings;
			},
			afterReturning: function( request ){
	            request.then(function() {}, function(jqXHR) {
	                if (statusCodeMapper.getAccountsMessage(jqXHR.status) && jqXHR.statusText !== 'timeout') {
	                    locationAPI.goURL(envConfig.AUTH_INDEX + storeSettings.get('logonUrl'));
	                }
	            });

				return request;
			}
	    };
	};
});
