define({
    'name': 'HEO_ACCOUNT_LOAN_INFORMATION',
    'bindings': {
        'primary_borrower_name': {
            'direction': 'DOWNSTREAM',
        },
        'secondary_borrower_name': {
            'direction': 'DOWNSTREAM',
        },
        'postal_address': {
            'direction': 'DOWNSTREAM',
        },
        'phone_number': {
            'direction': 'DOWNSTREAM',
        },
        'interest_rate': {
            'direction': 'DOWNSTREAM',
        },
        'interest_type': {
            'direction': 'DOWNSTREAM',
        },
        'loan_origination_date': {
            'direction': 'DOWNSTREAM',
        },
        'original_loan_amount': {
            'direction': 'DOWNSTREAM',
        },

        "total_monthly_payments": {
            'direction': 'DOWNSTREAM',
        },
        "total_monthly_payments_till_date": {
            'direction': 'DOWNSTREAM',
        },
        "account_principal_balance": {
            'direction': 'DOWNSTREAM',
        },
        "fees_and_charges": {
            'direction': 'DOWNSTREAM',
        },
        "interest_accrued": {
            'direction': 'DOWNSTREAM',
        }
    },
    'triggers': {

    }
});
