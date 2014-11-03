define({
	name: 'DDA_ACCOUNT_HEADER',
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
		'interest_rate': {
			direction: 'DOWNSTREAM'
		},
		'interest_year_till_date': {
			direction: 'DOWNSTREAM'
		},
		'number_of_withdrawals_this_period': {
			direction: 'DOWNSTREAM'
		},
		'account_available_balance': {
			direction: 'DOWNSTREAM'
		},
		'debit_card_coverage_enrollment_status': {
			direction: 'DOWNSTREAM'
		}
	},
	triggers: {}
});
