define({
	'name': 'UPDATE_MERCHANT_BILL_PAYMENT',
	'bindings': {
		'funding_account_display_name_with_balance':{
			direction:'BOTH'
		},
		'transaction_amount':{
			direction:'BOTH'
		},
		'transaction_notification_date':{
			direction:'BOTH'
		},
		'transaction_due_date':{
			direction:'BOTH'
		},
		'memo': {
      direction:'BOTH'
    },
		'payment_method_cutoff_time':{
			direction:'BOTH'
		}

	},
	'triggers': {
	    'initiate_update_merchant_bill_payment': {
	        action: 'initiate_update_merchant_bill_payment',
	        preventDefault: true
	    },
	    'verify_update_merchant_bill_payment': {
	        action: 'verify_update_merchant_bill_payment',
	        preventDefault: true
	    },
	    'confirm_update_merchant_bill_payment': {
	        action: 'confirm_update_merchant_bill_payment',
	        preventDefault: true
	    },
	    'cancel_update_merchant_bill_payment': {
	        action: 'cancel_update_merchant_bill_payment',
	        preventDefault: true
	    }
	}
});
