define(function() {
	return function paymentsActivityMenu() {
		var svcProps = {
			settings: {
				timeout: 8000
			}
		};
		this.serviceCalls = {
            'shared.privilege.list': svcProps,
            'getSharedPrivilege': {
            	settings: {
            		type: 'POST'
            	}
            }
        };
	};
});
