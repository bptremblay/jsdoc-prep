define(function(require) {
    var	requestHeader = require('dashboard/service/requestHeader');

    return {
		before: function( settings ){
        	console.log("BEFORE ----");

            var header = requestHeader.getHeader();

            if (Object.keys(header).length) {
                settings.beforeSend = function(xhr) {
                   for ( var key in header) {
                    	xhr.setRequestHeader(key, header[key]);
                   }
                };
            }

			return settings;
		},
		afterReturning: function( request ){
        	console.log("AFTER ----");
            request.then(function() {}, function(data) {
               console.log("REQUEST THEN---");
            });

			return request;
		}
    };
});
