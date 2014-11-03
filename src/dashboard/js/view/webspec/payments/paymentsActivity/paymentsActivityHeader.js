define({
    'name': 'PAYMENT_ACTIVITY_HEADER',
    'bindings': {
    	/* 'automatic_payment_enrollment_status': {
            'type': 'HTML',
            'field': 'automatic_payment_enrollment_status',
            'direction': 'BOTH'
        }
        */
    },
    'triggers': {
   		'exit-payment-activity':{
    		action: 'exit_payment_activity',
            type: 'HTML',
            event: 'click'
    	},
    }
});
