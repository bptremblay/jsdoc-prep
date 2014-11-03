define({
    'name': 'UPDATE_PAYMENT_DUE_DATE',
    'bindings': {},
    'triggers': {
        'initiate_update_payment_due_date': {
            'action': 'initiate_update_payment_due_date',
            'preventDefault': true
        },
        'cancel_update_payment_due_date': {
            'action': 'cancel_update_payment_due_date',
            'preventDefault': true
        },
        'exit_update_payment_due_date': {
            'action': 'exit_update_payment_due_date',
            'preventDefault': true
        }
    }
});
