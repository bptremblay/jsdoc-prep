define(function() {
    return function primarySearchService() {
        this.serviceCalls = {
            'conversationdeck.dashboard.primarysearch.svc': {
                settings: {
                	type: 'GET',
                    dataType: 'json'
                }
            },
            'conversationdeck.dashboard.primarysearch.typeahead.svc': {
                settings: {
                	type: 'GET',
                    dataType: 'json'
                }
            }
        };
    };
});
