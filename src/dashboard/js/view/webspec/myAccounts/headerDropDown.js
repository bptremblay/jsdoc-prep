define({
    'name': 'MORTGAGE_ACCOUNT_THINGS_YOU_CAN_DO',
    'bindings': {

    },
    'triggers': {
        'request_account_details': {
            'action': 'request_account_details'
        },
        'request_things_you_can_do': {
        	'action': 'request_things_you_can_do',
            'event': 'mouseenter'
        },
        'exit_things_you_can_do': {
        	'action': 'exit_things_you_can_do',
            'event': 'mouseleave'
        }
    }
});
