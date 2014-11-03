define({
	'name': 'CREDIT_ACCOUNT_CASH_ADVANCE_ANALYSIS',
	'bindings': {
			"account_cash_advance_limit": {
			direction: "DOWNSTREAM"
	    },
	    "account_cash_advance_balance": {
	      direction: "DOWNSTREAM"
	    },
	    "account_available_cash_advance_balance": {
	      direction: "DOWNSTREAM"
	    }
	},
	'triggers': {}
});
