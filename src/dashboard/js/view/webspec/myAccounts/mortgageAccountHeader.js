define({
    'name': 'MORTGAGE_ACCOUNT_HEADER',
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
        'next_payment_due_date': {
            direction: 'DOWNSTREAM'
        },
        'next_automatic_payment_message': {
            direction: 'DOWNSTREAM'
        },
        'next_payment_due_amount': {
            direction: 'DOWNSTREAM'
        },
        'mortgage_cash_back': {
            direction: 'DOWNSTREAM'
        },
        'automatic_payment_enrollment_status': {
            direction: 'DOWNSTREAM'
        },
        'paperless_statements_enrollment_status': {
            direction: 'DOWNSTREAM'
        }
    },
    'triggers': {
        'request_account_header_details': {
            action: 'request_account_header_details'
        },
        'request_automatic_payments_details': {
        	action: 'request_automatic_payments_details'
        },
        'request_paperless_statements_details': {
        	action: 'request_paperless_statements_details'
        },
        'enroll_for_automatic_payments': {
        	action: 'enroll_for_automatic_payments'
        },
        'enroll_for_paperless_statements': {
        	action: 'enroll_for_paperless_statements'
        }
    }
});
