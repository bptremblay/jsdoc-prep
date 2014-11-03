define({
	name: 'QPVERIFY',
	triggers: {
		send_next_button: {
			type: 'BUTTON',
			action: 'confirm_send_money'
		},
		send_cancel_button: {
			type: 'BUTTON',
			action: 'exit_send_money'
		},
		send_previous_button: {
			type: 'BUTTON',
			action: 'intiate_send_money'
		}
	}
});
