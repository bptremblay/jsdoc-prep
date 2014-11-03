define(function() {
	return function authService() {
		var svcProps = {
			settings: {
				timeout: 8000,
				type: 'POST',
				dataType: 'json'
			}
		};
		this.serviceCalls = {
			userenrollmentlocate: svcProps
		};
	};
});
