define(function() {
	return function singlePaymentService() {
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
			singlePaymentPayeeList: svcProps,
			singlePaymentOptionsList: svcProps,
			singlePaymentVerify: svcProps,
			singlePaymentConfirm: svcProps
		};
	};
});
