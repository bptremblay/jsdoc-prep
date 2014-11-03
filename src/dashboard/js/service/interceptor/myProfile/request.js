define(function(require) {
    var	requestHeader = require('dashboard/service/requestHeader');

    return {
		before: function( settings ){
            console.log('profile call settings:', settings);

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
            request.then(function() {}, function(jqXHR) {
                console.log('profile call jqXHR:', jqXHR);
            });

			return request;
		}
    };
});
