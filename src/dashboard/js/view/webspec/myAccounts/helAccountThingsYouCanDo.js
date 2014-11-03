define({
    'name': 'HEL_ACCOUNT_THINGS_YOU_CAN_DO',
    'bindings': {

    },
    'triggers': {
        'request_account_details': {
            'action': 'request_account_details'
        },
        'update_payment_due_date': {
            'action': 'update_payment_due_date',
            'preventDefault': true
        }
    }
});
