define({
	name: 'QP_DECLINE_OVERLAY',
	bindings: {
		memo: {
			type: 'TEXT',
			field: 'memo',
			direction: 'BOTH',
		}
	},
	triggers: {
		confirm_decline_payment: {
			type: 'BUTTON',
			action: 'confirmDeclineSendMoney'
		},
		confirm_decline_request: {
			type: 'BUTTON',
			action: 'confirmDeclineAcceptMoney'
		},
		cancel_decline: {
			type: 'BUTTON',
			action: 'doNotDeclineAcceptMoney'
		}
	}
});
