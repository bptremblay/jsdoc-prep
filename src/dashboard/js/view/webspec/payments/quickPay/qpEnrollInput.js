define({
	name: 'QPENROLLINPUT',
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
		next_button_click: {
			action: 'verify_quickpay_enrollment'
		},
		cancel_button_click: {
			action: 'cancel_quickpay_enrollment'
		},
		delete_email_click: {
			action: 'delete_email_address'
		},
		add_email_click: {
			action: 'add_money_transfer_profile_email_address'
		},
		email_dropdown_selected: {
			action: 'email_dropdown_selected'
		},
		email_address_entered: {
			action: 'setupAnotherEmailHandler'
		},
		agreement_checkbox_clicked: {
			action: 'agreement_checkbox_clicked'
		},
		primary_designation_selected: {
			action: 'designate_primary_email_address'
		},
		mobile_dropdown_selected: {
			action: 'mobile_dropdown_selected'
		},
		mobile_phone_entered: {
			action: 'mobile_phone_entered'
		}
	}
});
