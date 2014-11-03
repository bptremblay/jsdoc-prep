define({
    name: 'CREDIT_CARD_ACCOUNT_HEADER',
    bindings: {
        'account_name': {
            direction: 'DOWNSTREAM'
        },
        'account_mask_number': {
            direction: 'DOWNSTREAM'
        },
        'account_current_balance': {
            direction: 'DOWNSTREAM'
        },
        'payment_due_date': {
            direction: 'DOWNSTREAM'
        },
        'minimum_amount_due': {
            direction: 'DOWNSTREAM'
        },
        'blueprint_amount_due': {
            direction: 'DOWNSTREAM'
        },
        'account_available_credit_balance': {
            direction: 'DOWNSTREAM'
        }
    },
    triggers: {}
});
