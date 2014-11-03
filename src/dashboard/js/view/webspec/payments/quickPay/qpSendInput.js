define({
	name: 'QPSEND',
	bindings: {
		payee_id: {
			type: 'SELECT',
			field: 'payee_id',
			direction: 'BOTH'
		},
		payee_contact_info_id: {
			type: 'SELECT',
			field: 'payee_contact_info_id',
			direction: 'BOTH',
		},
		funding_account_id: {
			type: 'SELECT',
			field: 'funding_account_id',
			direction: 'BOTH',
		},
		transaction_amount: {
			type: 'TEXT',
			field: 'transaction_amount',
			direction: 'BOTH',
		},
		transaction_notification_date: {
			type: 'TEXT',
			field: 'transaction_notification_date',
			direction: 'BOTH',
		},
		memo: {
			type: 'TEXT',
			field: 'memo',
			direction: 'BOTH',
		},
	    payee_name: {
	      type: 'TEXT',
	      field: 'payee_name',
	      direction: 'BOTH',
	    },
	    payee_contact_info: {
	      type: 'TEXT',
	      field: 'payee_contact_info',
	      direction: 'BOTH',
	    },
	    funding_account_display_name: {
	      type: 'TEXT',
	      field: 'funding_account_display_name',
	      direction: 'BOTH',
	    },
	    account_balance: {
	      type: 'TEXT',
	      field: 'account_balance',
	      direction: 'BOTH',
	    },
	    transaction_number: {
	      type: 'TEXT',
	      field: 'transaction_number',
	      direction: 'BOTH',
	    },
	    transaction_expiry_date: {
	      type: 'TEXT',
	      field: 'transaction_expiry_date',
	      direction: 'BOTH',
	    },
	    transaction_recurring: {
	      type: 'TEXT',
	      field: 'transaction_recurring',
	      direction: 'BOTH',
	    },
	    transaction_frequency_option: {
	      type: 'TEXT',
	      field: 'transaction_frequency_option',
	      direction: 'BOTH',
	    },
	    transaction_notification_option_1: {
	      type: 'TEXT',
	      field: 'memo',
	      direction: 'BOTH',
	    },
	    transaction_notification_option_2: {
	      type: 'TEXT',
	      field: 'transaction_notification_option_1',
	      direction: 'BOTH',
	    },
	    transaction_duration: {
	      type: 'TEXT',
	      field: 'transaction_duration',
	      direction: 'BOTH',
	    },
	    transaction_duration_occurences: {
	      type: 'TEXT',
	      field: 'transaction_duration_occurences',
	      direction: 'BOTH',
	    },
	    transaction_notifications: {
	      type: 'TEXT',
	      field: 'transaction_notifications',
	      direction: 'BOTH',
	    }
	},
	triggers: {
		request_money_link: {
			type: 'ANCHOR',
			action: 'request_money'
		},
		send_next_button: {
			type: 'BUTTON',
			action: 'verify_send_money'
		},
		send_cancel_button: {
			type: 'BUTTON',
			action: 'cancel_send_money'
		},
		select_recipient: {
			type: 'SELECT',
			event: 'change',
			action: 'request_money_transfer_contact_info'
		},
		amount_change: {
			type: 'TEXT',
			action: 'transaction_amount_changed'
		},
		//Info icon
		quickpay_news_help_link:{
			type: 'ANCHOR',
			action: 'toggle_quickpay_news_help_message'
		},
		money_transfer_contact_help_icon:{
			type: 'ANCHOR',
			action: 'toggle_money_transfer_contact_help_message'
		},
		transaction_notification_date_help_icon:{
			type: 'ANCHOR',
			action: 'toggle_transaction_notification_date_help_message'
		},

		//info icon close
		quickpay_news_help_close:{
			type:'HTML',
			event: 'click',
			action:'hide_quickpay_news_help_message'
		},
		money_transfer_contact_help_close:{
			type: 'HTML',
			event: 'click',
			action: 'hide_money_transfer_contact_help_message'
		},
		transaction_notification_date_help_close:{
			type:'HTML',
			event:'click',
			action:'hide_transaction_notification_date_help_message'
		}

	}
});
