define(function(require) {
	var cookieMgr = require('logon/shared/cookieManager');

    return function() {
        this.before = function(settings) {
            var e2eScenario =  cookieMgr.readCookie('e2eScenario') && cookieMgr.readCookie('e2eScenario').length > 0 ?  cookieMgr.readCookie('e2eScenario') : null;
            if (e2eScenario && e2eScenario.indexOf('#') !== -1 ) {
                settings.beforeSend = function(xhr) {
                    xhr.setRequestHeader('x-jpmc-scenario', 'id=' + e2eScenario.substring(0, e2eScenario.indexOf('#')) + '; ts=' + e2eScenario.substring(e2eScenario.indexOf('#') + 1, e2eScenario.length));
                };
            }
            return settings;
        };
        return this;
    };

});
