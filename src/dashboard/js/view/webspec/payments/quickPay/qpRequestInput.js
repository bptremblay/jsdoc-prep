define({
	name: 'QPREQUESTINPUT',
	bindings: {
		memo: {
			type: 'TEXT',
			field: 'memo',
			direction: 'BOTH',
		},
		amount_option: {
			type: 'RADIO',
			field: 'transaction_amount_decision_maker',
			direction: 'BOTH',
		},
		request_money_due_date: {
			type: 'TEXT',
			field: 'request_money_due_date',
			direction: 'BOTH',
		},
	    payor_name: {
			type: 'TEXT',
			field: 'payor_name',
	        direction: 'BOTH'
	    },
	    payor_contact_info: {
			type: 'TEXT',
			field: 'payor_contact_info',
	        direction: 'BOTH'
	    },
	    transaction_amount: {
			type: 'TEXT',
			field: 'transaction_amount',
	        direction: 'BOTH'
	    },
	    transaction_amount_decision_maker: {
			type: 'TEXT',
			field: 'transaction_amount_decision_maker',
	        direction: 'BOTH'
	    },
	    request_money_due_date: {
			type: 'TEXT',
			field: 'request_money_due_date',
	        direction: 'BOTH'
	    },
	    transaction_number: {
			type: 'TEXT',
			field: 'transaction_number',
	        direction: 'BOTH'
	    },
	    transaction_expiry_date: {
			type: 'TEXT',
			field: 'transaction_expiry_date',
	        direction: 'BOTH'
	    },
	    payor_id: {
			type: 'SELECT',
			field: 'payor_id',
	        direction: 'BOTH'
	    },
	    payor_contact_info_id: {
			type: 'SELECT',
			field: 'payor_contact_info_id',
	        direction: 'BOTH'
	    }
	},
	triggers: {
		send_money_link: {
			type: 'ANCHOR',
			action: 'send_money'
		},
		next_button: {
			type: 'BUTTON',
			action: 'verify_request_money'
		},
		cancel_button: {
			type: 'BUTTON',
			action: 'cancel_request_money'
		},
		select_recipient: {
			type: 'SELECT',
			event: 'change',
			action: 'request_money_transfer_contact_info'
		},
		change_amount_option: {
			type: 'RADIO',
			event: 'change',
			action: 'toggle_transaction_amount_decision_maker'
		}
	}
});
