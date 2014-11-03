define(function() {
    return function paymentDateService() {
        var svcProps = { settings: {} },
	        svcGetProps = { settings: { type: 'GET' } };

        this.serviceCalls = {
            'paymentDateServiceList': svcProps,
            'paymentDateServiceVerify': svcProps,
            'paymentDateServiceConfirm': svcProps
        };
    };
});
