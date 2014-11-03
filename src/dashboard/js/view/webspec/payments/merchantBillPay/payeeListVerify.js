/*  ======== payeeListVerify ========== */
define({
	'name': 'PAYEE',
	'bindings': {
		'payee_name': {
			type: 'HTML',
			field: 'payee_name',
			direction: 'BOTH'
		},
		'payee_id': {
			type: 'RADIO',
			field: 'payee_id',
			direction: 'BOTH'
		},
		'payee_account_number': {
			type: 'HTML',
			field: 'payee_account_number',
			direction: 'BOTH'
		},
		'funding_account_id': {
			type: 'SELECT',
			field: 'funding_account_id',
			direction: 'BOTH'
		},
		'payee_category_id': {
			type: 'SELECT',
			field: 'payee_category_id',
			direction: 'BOTH'
		},
		'payee_nickname': {
			type: 'TEXT',
			field: 'payee_nickname',
			direction: 'BOTH'
		}
	},
	'triggers': {
		'address_link': {
			action: 'toggle_enter_different_address',
			type: 'ANCHOR',
            event: 'click'
		},
		'add_button': {
			type: 'BUTTON',
			action: 'add_payee'
		},
        'cancel_button': {
            type: 'BUTTON',
            action: 'exit_flow'
        },
        'prev_button': {
            type: 'BUTTON',
            action: 'reverse_flow'
        }
	}
});
