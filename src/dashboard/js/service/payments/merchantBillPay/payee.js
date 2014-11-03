define(function() {
	return function payeeService() {
		var svcProps = {
			settings: {
				timeout: 8000,
				type: 'POST',
				dataType: 'json',
				xhrFields: {
					withCredentials: true
				}
			}
		};
		this.serviceCalls = {
			payeeVerify: svcProps,
			payeeConfirm: svcProps
		};
	};
});
