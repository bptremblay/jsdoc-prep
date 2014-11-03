define({
    'name': 'MORTGAGE_ACCOUNT_RECENT_PAYMENT',
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
        },
        'payment_late_fees': {
            'direction': 'DOWNSTREAM',
        },
        'payment_grace_days': {
            'direction': 'DOWNSTREAM',
        },
        'automatic_payment_status': {
            'direction': 'DOWNSTREAM',
        },
        'next_automatic_payment_due_date': {
            'direction': 'DOWNSTREAM',
        }
    },
    'triggers': {}
});
