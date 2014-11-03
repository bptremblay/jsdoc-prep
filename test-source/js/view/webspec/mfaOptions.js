define({

	name: 'LOGON_IDENTIFICATION',
	bindings: {
 		'deviceoption': {
            type: 'RADIO',
            field: 'logon_identification_delivery_device',
            direction: 'UPSTREAM'
        }
	},
	triggers: {
		'request_identification_code': {
			type: 'BUTTON',
			action: 'request_identification_code'
		},
		'exit_identification': {
			type: 'BUTTON',
			action: 'exit_identification'
		},
		'provide_identification_code': {
			type: 'ANCHOR',
			action: 'provide_identification_code'
		},
		'request_identification_code_by_call' : {
		 	type: 'RADIO',
		 	action: 'request_identification_code_by_call'
	 	}
	}
});
