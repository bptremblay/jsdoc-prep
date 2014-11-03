define({
    'name': 'UPDATE_PAYMENT_DUE_DATE',
    'bindings': {
        'account_name': {
            'direction': 'DOWNSTREAM'
        },
        'account_mask_number': {
            'direction': 'DOWNSTREAM'
        },
        'payment_due_date': {
            'direction': 'DOWNSTREAM'
        },
        'next_payment_due_date_options': {
            'direction': 'UPSTREAM'
        }
    },
    'triggers': {
        'verify_update_payment_due_date': {
            'action': 'verify_update_payment_due_date',
            'preventDefault': true
        },
        'cancel_update_payment_due_date': {
            'action': 'cancel_update_payment_due_date',
            'preventDefault': true
        }
    }
});
