define({
    'name': 'RCA_HEADER',
    'bindings': {
        'account_name': {
            direction: 'DOWNSTREAM'
        },
        'account_mask_number': {
            direction: 'DOWNSTREAM'
        },
        'account_principal_balance': {
            direction: 'DOWNSTREAM'
        },
        'account_available_credit_balance': {
            direction: 'DOWNSTREAM'
        },
        'next_payment_due_date': {
            direction: 'DOWNSTREAM'
        },
        'next_payment_due_amount': {
            direction: 'DOWNSTREAM'
        },
        'fees_and_charges': {
            direction: 'DOWNSTREAM'
        },
        'accrued_interest': {
            direction: 'DOWNSTREAM'
        },
        'account_current_balance': {
            direction: 'DOWNSTREAM'
        }
    },
    'triggers': {
        'request_account_header_details': {
            action: 'request_account_header_details'
        },
        'request_account_current_balance_help_message': {
            action: 'request_account_current_balance_help_message',
            preventDefault: true
        },
        'exit_account_current_balance_help_message': {
        	action: 'exit_account_current_balance_help_message'
        }
    }
});
