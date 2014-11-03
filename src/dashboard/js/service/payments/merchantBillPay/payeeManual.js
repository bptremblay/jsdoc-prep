define(function() {
	return function payeeManualService() {
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
			payeeManualAddValidate: svcProps,
			payeeManualAddConfirm: svcProps
		};
	};
});
