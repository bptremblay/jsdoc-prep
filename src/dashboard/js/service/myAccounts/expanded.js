define(function() {
    return function expandedService() {
        var svcProps = { settings: {} },
	        svcGetProps = { settings: { type: 'GET' } };

        this.serviceCalls = {
        	'accounts.dda.prepaid.owner.svc': svcProps,
            'accounts.loan.expanded.svc': svcProps,
            'accounts.loan.expanded.svc': svcProps,
            'accounts.loan.expanded.svc': svcProps,
            'accounts.mortgage.expanded.svc': svcProps,
            'accounts.rca.expanded.svc': svcProps,
            'accounts.card.detail.svc': svcProps,
            'accounts.rewards.card.svc': svcProps,
            'accounts.heo.expanded.svc': svcProps
        };
    };
});
