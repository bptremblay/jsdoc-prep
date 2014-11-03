define({
	name: 'QPNOTIFICATIONSCHEDULE',
	bindings: {
		'transaction_notifications':{
			direction: 'BOTH'
		}
	},
	triggers: {
		toggle_transaction_notifications: {
			action: 'toggle_transaction_notifications'
		}
	}
});
