define({
	name: 'QPTODO',
	bindings: {
		show: {
			type: 'SELECT',
			field: 'show',
			direction: 'BOTH'
		},
		transaction_notification_date: {
			type: 'TEXT',
			field: 'transaction_notification_date',
			direction: 'BOTH',
		},
		transaction_requestor: {
			type: 'TEXT',
			field: 'transaction_requestor',
			direction: 'BOTH',
		},
		transaction_amount: {
			type: 'TEXT',
			field: 'transaction_amount',
			direction: 'BOTH',
		},
		transaction_type: {
			type: 'TEXT',
			field: 'transaction_type',
			direction: 'BOTH',
		},
		memo: {
			type: 'TEXT',
			field: 'memo',
			direction: 'BOTH',
		},
		my_money_transfer_profile_info: {
			type: 'TEXT',
			field: 'my_money_transfer_profile_info',
			direction: 'BOTH',
		},
		transaction_modification_status: {
			type: 'TEXT',
			field: 'transaction_modification_status',
			direction: 'BOTH',
		},
		funding_account_display_name: {
			type: 'TEXT',
			field: 'funding_account_display_name',
			direction: 'BOTH',
		}
	},
	triggers: {
		accept_money: {
			type: 'BUTTON',
			action: 'accept_money'
		},
		show: {
			type: 'SELECT',
			event: 'change',
			action: 'filter_by_notification_direction'
		},
		see_more: {
			type: 'BUTTON',
			action: 'see_more'
		},
		close: {
			type: 'BUTTON',
			action: 'exitPendingActionsActivity'
		},
		decline_accept: {
			type: 'ANCHOR',
			action: 'declineAcceptMoney'
		},
		decline_send: {
			type: 'ANCHOR',
			action: 'declineSendMoney'
		},
		request_transaction_details: {
			type: 'ANCHOR',
			action: 'transactionDetails'
		},
 		request_money_transfer_pending_actions_activity: {
 			type: 'BUTTON',
 			action: 'request_money_transfer_pending_actions_activity'
 		}

	}
});
