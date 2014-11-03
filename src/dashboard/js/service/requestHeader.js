define(function(require) {
	var storeSettings = require('blue/settings'),
		cookie = new(require('blue/store/enumerable/cookie'))('scenario');

	var	authcsrftokenHeader = 'x-jpmc-csrf-token', e2eScenarioHeader = 'x-jpmc-scenario';

	var	getAuthCSRFTokenValue = function() {
			var authcsrftokenCookiePattern = new RegExp('authcsrftoken' + '=([^;]+)'),
				matches = document.cookie.match(authcsrftokenCookiePattern);

			if (matches && matches[1]) {
				return matches[1];
			}

			return undefined;
		};

	return {
		getHeader: function(){
			var requestHeader = {},
				authcsrftoken = getAuthCSRFTokenValue(),
				e2eScenario = storeSettings.get('e2eScenario', storeSettings.Type.PERM);

			if (authcsrftoken) {
				requestHeader[authcsrftokenHeader] = authcsrftoken;
			};

			if (e2eScenario) {
				requestHeader[e2eScenarioHeader] = "id=" + e2eScenario.scenarioIdFixture + "; ts=" + e2eScenario.scenarioDateTimeFixture;
			} else {
				//Local Storage unavailabe across sub domain, 'e2eScenario' cookie available across sub domains
				e2eScenario = cookie.get('e2eScenario');
				if (e2eScenario) {
					requestHeader[e2eScenarioHeader] = "id=" + e2eScenario.scenarioIdFixture + "; ts=" + e2eScenario.scenarioDateTimeFixture;
				}
			}

			return requestHeader;
		}
	};
});
