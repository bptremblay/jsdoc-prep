define({
    name: 'CREDIT_CARD_ACCOUNT',
    bindings: {
		'account_name': {
			direction: 'DOWNSTREAM'
		},
		'account_mask_number': {
			direction: 'DOWNSTREAM'
		},
        'account_current_balance': {
            direction: 'DOWNSTREAM',
        }
    },
    triggers: {
        'request_account_information': {
            action: 'request_account_information'
        }

    },
});
