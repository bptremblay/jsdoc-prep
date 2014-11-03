define({
    'name': 'PAYMENT_ACTIVITY_MENU',
    'bindings': {},
    'triggers': {
    	'credit-card-link':{
    		action: 'requestCreditCardPaymentActivity',
            type: 'HTML',
            event: 'click'
    	},
    	'exit-payment-activity':{
    		action: 'exitPaymentActivity',
            type: 'HTML',
            event: 'click'
    	}
    }
});
