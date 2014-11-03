define({
	'name': 'CREDIT_ACCOUNT_APR_ANALYSIS',
	'bindings': {
		"purchase_apr": {
	      direction: "DOWNSTREAM"
	    },
	    "cash_apr": {
	      direction: "DOWNSTREAM"
	    },
	    "account_update_date": {
	      direction: "DOWNSTREAM"
	    }
	},
	'triggers': {}
});
