define(function() {

	return function callService() {
		var svcProps = {
			settings: {
				timeout: 20000,
				type: 'POST',
				xhrFields: {
					withCredentials: true
				}
			}
		};

		var svcPropsJSON = {
			settings: {
				timeout: 20000,
				type: 'GET',
				xhrFields: {
					withCredentials: true
				}
			}
		};

		this.serviceCalls = {           
			'addValidate': svcProps,
			'addFundingAccount': svcProps
		};
	};


});
