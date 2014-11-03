define({
	name: 'QPENROLLSETUP',
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
		setup_button: {
			type: 'BUTTON',
			action: 'initiate_quickpay_enrollment'
		},
		cancel_button: {
			type: 'BUTTON',
			action: 'cancel_quickpay_enrollment'
		}
	}
});
