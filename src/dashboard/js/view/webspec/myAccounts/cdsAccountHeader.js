define({
	name: 'CDS_ACCOUNT_HEADER',
	bindings: {
		'account_display_name': {
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
		'interest_accrued': {
			direction: 'DOWNSTREAM'
		},
		'interest_earned_YTD': {
			direction: 'DOWNSTREAM'
		},
		'issue_date': {
			direction: 'DOWNSTREAM'
		},
		'maturity_date': {
			direction: 'DOWNSTREAM'
		},
		'annual_percentage_yield': {
			direction: 'DOWNSTREAM'
		},
		'account_available_balance': {
			direction: 'DOWNSTREAM'
		}
	},
	'triggers': {}
});
