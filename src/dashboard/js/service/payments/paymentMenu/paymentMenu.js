define(function() {
	return function paymentMenu() {
		var svcProps = {
			settings: {
				type: 'POST',
				xhrFields: {
					withCredentials: true
				}
			}
		};
		this.serviceCalls = {
            'shared.privilege.list': svcProps
        };
	};
});
