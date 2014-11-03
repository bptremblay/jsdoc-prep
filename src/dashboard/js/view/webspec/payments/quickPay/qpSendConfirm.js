define({
	name: 'QPCONFIRM',
	triggers: {
		send_close_button: {
			type: 'BUTTON',
			action: 'exit_send_money'
		},
		send_more_money_button: {
			type: 'BUTTON',
			action: 'send_more_money'
		}
	}
});
