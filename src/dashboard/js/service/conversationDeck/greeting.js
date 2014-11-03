define(function() {
    return function greetingService() {
        this.serviceCalls = {
            'conversationdeck.dashboard.greeting.svc': {
                settings: {
                	type: 'POST',
                    dataType: 'json'
                }
            }
        };
    };
});
