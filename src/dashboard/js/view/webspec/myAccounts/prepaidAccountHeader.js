define({
    name: 'PREPAID_ACCOUNT_HEADER',
    bindings: {
        'account_name': {
            direction: 'DOWNSTREAM'
        },
        'account_mask_number': {
            direction: 'DOWNSTREAM'
        },
        'account_balance': {
            direction: 'DOWNSTREAM'
        },
        'last_statement_date': {
            direction: 'DOWNSTREAM'
        },
        'last_deposit_date': {
            direction: 'DOWNSTREAM'
        },
        'card_account_type': {
            direction: 'DOWNSTREAM'
        },
        'account_available_balance': {
			direction: 'DOWNSTREAM'
		}
    },
    triggers: {}
});
