define({
    'name': 'MORTGAGE_ACCOUNT_TILE',
    'bindings': {
        'account_name': {
            direction: 'DOWNSTREAM'
        },
        'next_payment_due_amount': {
            direction: 'DOWNSTREAM'
        },
        'account_mask_number': {
            direction: 'DOWNSTREAM'
        },
    },
    'triggers': {
        'request_account_information': {
            action: 'request_account_information'
        },
        'toggle_account_tile': {
        	action: 'toggle_account_tile'
        },
        'request_account_summary': {
        	action: 'request_account_summary'
        }
    }
});
