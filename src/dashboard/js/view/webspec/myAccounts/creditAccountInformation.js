define({
	'name': 'CREDIT_ACCOUNT_INFORMATION',
	'bindings': {
		"account_outstanding_balance": {
	      direction: "DOWNSTREAM"
	    },
	    "account_pending_charges": {
	      direction: "DOWNSTREAM"
	    },
	    "account_credit_limit": {
	      direction: "DOWNSTREAM"
	    },
	    "account_available_credit_balance": {
	      direction: "DOWNSTREAM"
	    },
	    "account_statement_generation_date": {
	      direction: "DOWNSTREAM"
	    },
	    "account_last_statement_balance": {
	      direction: "DOWNSTREAM"
	    },
	    "account_last_statement_date": {
	      direction: "DOWNSTREAM"
	    }
	},
	'triggers': {}
});
