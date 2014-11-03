define(function() {
    return function activityService() {
        var svcProps = { settings: { timeout: 8000 } },
	        svcGetProps = { settings: { type: 'GET' } };

        this.serviceCalls = {
            'accounts.dda.activity.svc': svcProps,
            'accounts.card.activity.svc': svcProps,
            'accounts.dda.onHold.svc': svcProps,
            'accounts.loan.activity.svc': svcProps,
            'accounts.mortgage.activity.svc': svcProps,
            'accounts.auto.activity.svc': svcProps,
            'accounts.card.activity.detail.svc': svcProps
        };
    };
});
