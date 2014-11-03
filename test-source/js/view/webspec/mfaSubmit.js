define({
	name: 'LOGON_IDENTIFICATION',
	bindings: {
		'password': {
            type: 'PASSWORD',
            field: 'password',
            direction: 'BOTH'
        },
		'identification_code': {
			type: 'TEXT',
			field: 'identification_code',
			direction: 'BOTH'
		}
	},
	triggers: {
		'log_on_to_landing_page': {
			type: 'BUTTON',
			action: 'log_on_to_landing_page'
		},
		'exit_identification': {
			type: 'BUTTON',
			action: 'exit_identification'
		},
		'request_new_identification_code': {
			type: 'ANCHOR',
			action: 'request_new_identification_code'
		}
	}
});
