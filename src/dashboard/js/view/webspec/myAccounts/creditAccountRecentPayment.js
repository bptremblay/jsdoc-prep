define({
	'name': 'CREDIT_ACCOUNT_RECENT_PAYMENT',
	'bindings': {
		"last_payment_amount": {
	      direction: "DOWNSTREAM"
	    },
	    "last_payment_date": {
	      direction: "DOWNSTREAM"
	    },
	    "minimum_amount_due": {
	      direction: "DOWNSTREAM"
	    },
	    "minimum_amount_due_date": {
	      direction: "DOWNSTREAM"
	    },
	    "account_available_credit_balance": {
	      direction: "DOWNSTREAM"
	    }

	},
	'triggers': {}
});
