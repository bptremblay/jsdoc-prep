define({
    'name': 'EXIT_UPDATE_PAYMENT_DUE_DATE_CONFIRMATION',
    'bindings': {},
    'triggers': {
        'do_not_exit_update_payment_due_date': {
            'action': 'do_not_exit_update_payment_due_date',
            'preventDefault': true
        },
        'confirm_exit_update_payment_due_date': {
            'action': 'confirm_exit_update_payment_due_date',
            'preventDefault': true
        }
    }
});
