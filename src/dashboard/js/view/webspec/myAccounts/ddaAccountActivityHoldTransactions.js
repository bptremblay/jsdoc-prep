define({
    name: 'DDA_ACCOUNT_ACTIVITY_HOLD_TRANSACTIONS',
    bindings: {
		'transactions': {
            direction: 'DOWNSTREAM'
        },
	    'total_transactions_on_hold': {
            direction: 'DOWNSTREAM'
	    },
	    'total_value_of_holds': {
            direction: 'DOWNSTREAM'
	    }
    },
    triggers: {}
});
