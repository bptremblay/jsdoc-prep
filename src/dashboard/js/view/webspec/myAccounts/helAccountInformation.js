define({
    'name': 'HEL_ACCOUNT_INFORMATION',
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
        'loan_origination_date': {
            'direction': 'DOWNSTREAM',
        },
        'original_loan_amount': {
            'direction': 'DOWNSTREAM',
        }
    },
    'triggers': {
    	'update_payment_due_date': {
            'action': 'update_payment_due_date',
            'preventDefault': true
        }
    }
});
