define({
	name: 'QPREPEATINGPAYMENTOPTIONS',
	bindings: {
		frequency: {
			type: 'SELECT',
			field: 'transaction_frequency_option',
			direction: 'BOTH'
		},
		notify_on_single_option1: {
			type: 'SELECT',
			field: 'transaction_notification_option_1',
			direction: 'BOTH'
		},
		notify_on_multi_option1: {
			type: 'SELECT',
			field: 'transaction_notification_option_1',
			direction: 'BOTH'
		},
		notify_on_multi_option2: {
			type: 'SELECT',
			field: 'transaction_notification_option_2',
			direction: 'BOTH'
		},
		first_notification_date: {
			type: 'SELECT',
			field: 'transaction_notification_date',
			direction: 'BOTH'
		},
		transaction_duration_option: {
			type: 'RADIO',
			field: 'transaction_duration',
			direction: 'BOTH',
		},
		transaction_duration_occurrences: {
			type: 'TEXT',
			field: 'transaction_duration_occurrences',
			direction: 'BOTH'
		}
	},
	triggers: {
		repeating_payment_on_link: {
			type: 'ANCHOR',
			event: 'click keydown',
			action: 'repeating_payment_on'
		},
		repeating_payment_off_link: {
			type: 'ANCHOR',
			event: 'click keydown',
			action: 'repeating_payment_off'
		},
		frequency_change: {
			type: 'SELECT',
			event: 'change',
			action: 'request_transaction_notification_options'
		},
		notify_on_single_option1_change: {
			type: 'SELECT',
			event: 'change',
			action: 'notify_on_option1_changed'
		},
		notify_on_multi_option1_change: {
			type: 'SELECT',
			event: 'change',
			action: 'notify_on_option1_changed'
		},
		notify_on_multi_option2_change: {
			type: 'SELECT',
			event: 'change',
			action: 'notify_on_option2_changed'
		},
		first_notification_date_change: {
			type: 'SELECT',
			event: 'change',
			action: 'first_notification_date_changed'
		},
		transaction_duration_option_change: {
			type: 'RADIO',
			event: 'change',
			action: 'toggle_transaction_duration_option'
		},
		transaction_duration_occurrences_change: {
			type: 'TEXT',
			action: 'transaction_duration_occurrences_changed'
		},
		transaction_notification_recurring_date_help_icon:{
			type: 'ANCHOR',
			action:'toggle_transaction_notification_recurring_date_help_message'
		},
		transaction_notification_recurring_date_help_close : {
			type:'HTML',
			event: 'click',
			action: 'hideTransactionNotificationRecurringDateHelpMessage'
		},
		transaction_notification_option_help_icon:{
			type: 'ANCHOR',
			action:'toggle_transaction_notification_option_help_message'
		},
		transaction_notification_option_help_close:{
			type:'HTML',
			event: 'click',
			action:'hide_transaction_notification_option_help_message'
		},
		transaction_notification_multioption_help_icon:{
			type: 'ANCHOR',
			action:'toggle_transaction_notification_multiOption_help_message'
		},
		transaction_notification_multioption_help_close:{
			type:'HTML',
			event:'click',
			action:'hide_transaction_notification_multioption_help_message'
		}

	}
});
