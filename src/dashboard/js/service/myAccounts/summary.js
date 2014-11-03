define(function() {
    return function summaryService() {
        var svcProps = { settings: {} },
	        svcGetProps = { settings: { type: 'GET' } };

        this.serviceCalls = {
            'accounts.dashboard.summary.svc': svcProps,
            'accounts.dashboard.summary.refresh.svc': svcProps
        };
    };
});
