define({
	name: 'QPREQUESTVERIFY',
	triggers: {
		previous_button: {
			type: 'BUTTON',
			action: 'intiate_request_money'
		},
		cancel_button: {
			type: 'BUTTON',
			action: 'cancel_request_money'
		},
		next_button: {
			type: 'BUTTON',
			action: 'confirm_request_money'
		}
	}
});
