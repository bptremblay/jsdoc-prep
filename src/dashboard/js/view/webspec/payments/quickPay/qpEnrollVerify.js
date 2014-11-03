define({
	name: 'QPENROLLVERIFY',
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
		next_button: {
			type: 'BUTTON',
			action: 'confirm_quickpay_enrollment'
		},
		close_button: {
			type: 'BUTTON',
			action: 'exit_quickpay_enrollment'
		},
		text_verify: {
			type: 'TEXT',
			action: 'validate_verification_code'
		},
		resend_code: {
			type: 'ANCHOR',
			action: 'resend_verification_code'
		}
	}
});
