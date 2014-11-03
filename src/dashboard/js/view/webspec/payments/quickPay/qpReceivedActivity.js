define({
	name: 'QPRECEIVEDACTIVITY',
	triggers: {
		see_details_link: {
			type: 'ANCHOR',
			action: 'show_transactions'
		},
		see_more: {
			type: 'BUTTON',
			action: 'see_more'
		},
		close: {
			type: 'BUTTON',
			action: 'exitReceivedMoneyActivity'
		}
	}
});
