define({
    'name': 'ACCOUNT_DETAILS_HEADER',
    'bindings': {
    	'account_display_name': {
            direction: 'DOWNSTREAM'
        },
        'account_update_date': {
            direction: 'DOWNSTREAM'
        }
    },
    'triggers': {
        'close_account_details': {
            action: 'close_account_details',
            stopPropagation: true,
            preventDefault: true
        }
    }
});
