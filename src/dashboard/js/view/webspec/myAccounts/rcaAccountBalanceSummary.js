define({
    'name': 'RCA_ACCOUNT_BALANCE_SUMMARY',
    'bindings': {
        'account_principal_balance': {
            'direction': 'DOWNSTREAM',
        },
        'fees_and_charges': {
            'direction': 'DOWNSTREAM',
        },
        'interest_accrued': {
            'direction': 'DOWNSTREAM',
        },
        'account_current_balance': {
            'direction': 'DOWNSTREAM',
        },
        'account_available_credit_balance': {
            'direction': 'DOWNSTREAM',
        }
    },
    'triggers': {

    }
});
