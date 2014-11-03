define({
    'name': 'HEO_ACCOUNT_RECENT_PAYMENT',
    'bindings': {
        'last_payment_amount': {
            'direction': 'DOWNSTREAM',
        },
        'last_payment_date': {
            'direction': 'DOWNSTREAM',
        },
        'next_payment_due_amount': {
            'direction': 'DOWNSTREAM',
        },
        'next_payment_due_date': {
            'direction': 'DOWNSTREAM',
        }
    },
    'triggers': {}
});
