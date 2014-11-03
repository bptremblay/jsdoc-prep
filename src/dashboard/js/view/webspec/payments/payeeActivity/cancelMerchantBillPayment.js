define({
	'name': 'CANCEL_MERCHANT_BILL_PAYMENT',
	'bindings': {
		'payee_name':{
			direction:'BOTH'
		},
		'memo':{
			direction:'BOTH'
		}
	},
	'triggers': {
	    'do_not_cancel_merchant_bill_payment': {
	        action: 'do_not_cancel_merchant_bill_payment',
	        preventDefault: true
	    },
	    'confirm_cancel_merchant_bill_payment': {
	        action: 'confirm_cancel_merchant_bill_payment',
	        preventDefault: true
	    }
	}
});
