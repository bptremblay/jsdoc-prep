define({
    'name': 'MORTGAGE_ACCOUNT_CASH_BACK',
    'bindings': {
        'cash_back_balance': {
            'direction': 'DOWNSTREAM'
        }
    },
    'triggers': {
        'request_reward_details': {
            'action': 'request_reward_details'
        }
    }
});
