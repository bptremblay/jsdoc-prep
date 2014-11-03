define({
	'name': 'PAYEE_ACTIVITY',
	'bindings': {
		'payee_activity_transactions':{
			direction:'BOTH'
		},
		'payee_name':{
			direction:'BOTH'
		},
		'additional_transaction_activity':{
			direction:'BOTH'
		}

	},
	'triggers': {
	    'see_more_click': {
	        action: 'show_transactions',
	        preventDefault: true
	    },
	    'see_details_click': {
	        action: 'request_transaction_details',
	        preventDefault: true
	    },
	    'hide_details_click': {
	        action: 'hide_transaction_details',
	        preventDefault: true
	    },
	    'update_transaction_click': {
	        action: 'update_transaction',
	        preventDefault: true
	    },
	    'cancel_transaction': {
	    	action: 'cancel_transaction',
	    	preventDefault: true
	    }
	}
});
