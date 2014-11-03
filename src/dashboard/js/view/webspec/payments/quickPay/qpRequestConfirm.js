define({
	name: 'QPREQUESTCONFIRM',
	triggers: {
		close_button: {
			type: 'BUTTON',
			action: 'exit_request_money'
		},
		request_more_money_button: {
			type: 'BUTTON',
			action: 'request_more_money'
		}
	}
});
