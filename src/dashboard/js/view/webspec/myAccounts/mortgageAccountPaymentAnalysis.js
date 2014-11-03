define({
    'name': 'MORTGAGE_ACCOUNT_PAYMENT_ANALYSIS',
    'bindings': {
        'payment_analysis_year': {
            'direction': 'DOWNSTREAM',
        },
        'interest_paid_in_year': {
            'direction': 'DOWNSTREAM',
        },
        'principal_paid_in_year': {
            'direction': 'DOWNSTREAM',
        },
        'taxes_paid_in_year': {
           'direction': 'DOWNSTREAM',
        }
    },
    'triggers': {}
});
