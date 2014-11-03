define({
    'name': 'DDA_ACCOUNT_THINGS_YOU_CAN_DO',
    'bindings': {
    	'debit_card_coverage_settings_available': {
			direction: 'DOWNSTREAM'
		}
    },
    'triggers': {
        'request_account_details': {
            'action': 'request_account_details'
        }
    }
});
