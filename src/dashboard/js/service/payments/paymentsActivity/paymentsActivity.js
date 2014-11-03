define(function() {

    return function paymentsActivity() {
        var svcProps = {
            settings: {
                timeout: 8000,
                type: 'POST',
                xhrFields: {
                    withCredentials: true
                }
            }
        };

        var svcPropsMock = {
            settings: {
                timeout: 8000,
                type: 'GET',
                xhrFields: {
                    withCredentials: true
                }
            }
        };

        this.serviceCalls = {           
    		'paymentsActivityList': svcProps,
            'getFormDetails': svcProps
        };
    };

});
