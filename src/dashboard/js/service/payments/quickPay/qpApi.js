define(function() {
    return function qpApi() {
        var svcProps = {
			settings: {
                timeout: 8000,
                statusCodeField: 'statusCode',
                handleServerSideValidation: function (data) {
                    //TODO remove this console.warn; this if for testing only
                    console.warn('Data success!', data);
                        if ( data.statusCode &&( data.statusCode === 'CANCELD' || data.statusCode === 'IN_PROCESS_CHASE_FROM_NON_CHASE'
                            || data.statusCode ==='IN_PROCESS_NON_CHASE' || data.statusCode === 'IN_PROCESS_CHASE'
                            || data.statusCode === 'IN_PROCESS_CXE'))
                        {
                            data.markAsSuccess = true;
                        }

                    return data;
                    },
                handleError: function (response) {
                    console.warn('Error code encountered!', response.status);
                    console.warn('Error code encountered!', response.responseJSON );
                }
			}
        };
        var svcPropsLocal = {
			settings: {
				type: 'GET',
				statusCodeField: 'statusCode',
                handleServerSideValidation: function (data) {
                    //TODO remove this console.warn; this if for testing only
                    console.warn('Data success!', data);
                        //data.statusCode = 'ACCOUNT_NOT_FOUND';
                    return data;
                    },
                handleError: function (response) {
                    console.warn('Error code encountered!', response.status);
                    console.warn('Error code encountered!', response.responseJSON );
                }
			}
        };

        this.serviceCalls = {
            'quickpay.recipient.list': svcProps,
            'quickpay.addoptions.list': svcProps,
            // TODO: list2 service returns recipient data, remove it when connecting to api
            'quickpay.addoptions.list2': svcProps,
            'quickpay.payment.add': svcProps,
            'quickpay.todo.list' : svcProps,
            'quickpay.todo.accept' : svcProps,
            'quickpay.todo.decline.overlay.payment' : svcProps,
            'quickpay.todo.decline.payment' : svcProps,
            'quickpay.todo.decline.overlay.request' : svcProps,
            'quickpay.todo.decline.request' : svcProps,
            'quickpay.request.validate' : svcProps,
            'quickpay.request.add' : svcProps,
            'quickpay.sentactivity.list' : svcProps,
            'quickpay.receivedactivity.list' : svcProps,
            'quickpay.enrollmentoptions.list' : svcProps,
            'quickpay.enrollment.add' : svcProps,
            'quickpay.enrollment.contact.list' : svcProps,
            'quickpay.enrollment.resendcode' : svcProps,
            'quickpay.contact.verify' : svcProps,
            'quickpay.payment.repeating.dateoptions.list' : svcProps,
            'quickpay.payment.repeating.datespreview.list' : svcProps,
            'quickpay.payment.repeating.add' : svcProps,
            'quickpay.payment.repeating.validate' : svcProps,
            'quickpay.payment.validate' : svcProps
        };
    };
});
