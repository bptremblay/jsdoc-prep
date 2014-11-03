define({
    'name': 'RCA_ACCOUNT',
    'bindings': {
        'account_current_balance': {
            direction: 'DOWNSTREAM'
        },
        'account_name': {
            direction: 'DOWNSTREAM'
        },
        'account_mask_number': {
            direction: 'DOWNSTREAM'
        },
    },
    'triggers': {
        'request_account_information': {
            action: 'request_account_information'
        }
    }
});
