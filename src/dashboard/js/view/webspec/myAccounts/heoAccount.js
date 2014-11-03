define({
    'name': 'HEO_ACCOUNT',
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
    },
    'toggle_account_tile': {
        action: 'toggle_account_tile'
    }
});
