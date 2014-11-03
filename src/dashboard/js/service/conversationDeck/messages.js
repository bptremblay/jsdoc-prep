define(function() {
    return function messagesService() {

        this.serviceCalls = {
            'conversationdeck.dashboard.messages.svc': {
                settings: {
                	type: 'POST',
                    dataType: 'json'
                }
            },
			'conversationdeck.dashboard.messageUpdate.svc': {
                settings: {
                	type: 'POST',
                    dataType: 'json'
                }
            },
			'conversationdeck.dashboard.messageUpdateAll.svc': {
                settings: {
                	type: 'POST',
                    dataType: 'json'
                }
            }
        };

    };
});
