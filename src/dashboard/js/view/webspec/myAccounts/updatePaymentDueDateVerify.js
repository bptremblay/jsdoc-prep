define({
    'name': 'UPDATE_PAYMENT_DUE_DATE',
    'bindings': {
        'account_name': {
            'direction': 'DOWNSTREAM'
        },
        'account_mask_number': {
            'direction': 'DOWNSTREAM'
        },
        'primary_borrower_name': {
            'direction': 'DOWNSTREAM'
        },
        'payment_due_date': {
            'direction': 'DOWNSTREAM'
        },
        'next_payment_due_date': {
            'direction': 'DOWNSTREAM'
        }
    },
    'triggers': {
        'confirm_update_payment_due_date': {
            'action': 'confirm_update_payment_due_date',
            'preventDefault': true
        },
        'initiate_update_payment_due_date': {
            'action': 'initiate_update_payment_due_date',
            'preventDefault': true
        },
        'cancel_update_payment_due_date': {
            'action': 'cancel_update_payment_due_date',
            'preventDefault': true
        }
    }
});
