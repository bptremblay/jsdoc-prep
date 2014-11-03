define({
	name: 'QPENROLLCONFIRM',
	bindings: {
		'email_addresses':{
			direction: 'BOTH'
		},
		'phone_numbers':{
			direction: 'BOTH'
		},
		'quickpay_enrollment_legal_acceptance': {
			direction: 'BOTH'
		},
	    'quickpay_pending_actions_count': {
	      direction: 'BOTH'
	    }
	},
	triggers: {
		send_money_button: {
			type: 'BUTTON',
			action: 'send_money'
		},
		request_money_button: {
			type: 'BUTTON',
			action: 'request_money'
		},
		close_button: {
			type: 'BUTTON',
			action: 'exit_quickpay_enrollment'
		}
	}
});
