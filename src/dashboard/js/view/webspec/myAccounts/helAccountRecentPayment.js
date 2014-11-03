define({
    'name': 'HEL_ACCOUNT_RECENT_PAYMENT',
    'bindings': {
        'last_payment_amount': {
            'direction': 'DOWNSTREAM',
        },
        'next_payment_due_amount': {
            'direction': 'DOWNSTREAM',
        },
        'next_payment_due_date': {
            'direction': 'DOWNSTREAM',
        },
        'next_automatic_payment_due_date': {
            'direction': 'DOWNSTREAM',
        }
    },
    'triggers': {}
});
