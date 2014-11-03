define({
	name: 'QPSENTACTIVITY',
	triggers: {
		see_details_link: {
			type: 'ANCHOR',
			action: 'show_transactions'
		},
		edit_link: {
			type: 'ANCHOR',
			action: 'edit'
		},
		cancel_link: {
			type: 'ANCHOR',
			action: 'cancel'
		},
		send_inquiry_link: {
			type: 'ANCHOR',
			action: 'send_inquiry'
		},
		see_more: {
			type: 'BUTTON',
			action: 'see_more'
		},
		close: {
			type: 'BUTTON',
			action: 'exitSentMoneyActivity'
		}
	}
});
