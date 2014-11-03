define({
    'name': 'HEO_ACCOUNT_HEADER',
    'bindings': {

        'account_display_name': {
            'direction': 'DOWNSTREAM'
        },
        'account_nickname': {
            'direction': 'DOWNSTREAM'
        },
        'account_mask_number': {
            'direction': 'DOWNSTREAM'
        },
        'account_principal_balance': {
            'direction': 'DOWNSTREAM'

        },
        'next_payment_due_date': {
            'direction': 'DOWNSTREAM',

        },

        'next_payment_due_amount': {
            'direction': 'DOWNSTREAM'

        }


    },
    'triggers': {
        'request_account_details': {
            'action': 'request_account_details'

        }


    }
});
