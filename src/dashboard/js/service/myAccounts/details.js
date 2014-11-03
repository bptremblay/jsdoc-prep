define(function() {
    return function detailService() {
        var svcProps = { settings: {} },
	        svcGetProps = { settings: { type: 'GET' } };

        this.serviceCalls = {
            'accounts.card.detail.svc': svcProps,
            'accounts.dda.detail.svc': svcProps,
            'accounts.loan.detail.svc': svcProps,
            'accounts.mortgage.detail.svc': svcProps,
            'accounts.auto.detail.svc': svcProps,
            'accounts.dda.prepaid.owner.svc': svcProps,
            'accounts.prepaid.detail.svc': svcProps,
            'accounts.card.activity.detail.svc': svcProps
        };
    };
});
