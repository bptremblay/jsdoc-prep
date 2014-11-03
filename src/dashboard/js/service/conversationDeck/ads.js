define(function() {

	return function adsService() {

		this.AD_DISMISS_SERVICE_URL = 'https://d.xp1.ru4.com/activity';

		this.serviceCalls = {
			'conversationdeck.ads.decision.svc': {
				settings: {
	        		type: 'GET',
	        		dataType: 'jsonp'
				}
			}
		};

	};

});
