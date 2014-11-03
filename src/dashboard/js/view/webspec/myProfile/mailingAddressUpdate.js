define({
	name: 'MY_PROFILE_ADDRESS_UPDATE',
	bindings: {
		mailing_address_line1: {
			direction: 'UPSTREAM',
			type: 'TEXT'
		},
		mailing_address_line2: {
			direction: 'UPSTREAM',
			type: 'TEXT'
		},
		mailing_address_line3: {
			direction: 'UPSTREAM',
			type: 'TEXT'
		},
		city: {
			direction: 'UPSTREAM',
			type: 'TEXT'
		},
		state: {
			direction: 'UPSTREAM',
			type: 'TEXT'
		},
		postal_code: {
			direction: 'UPSTREAM',
			type: 'TEXT'
		},
		zip_code: {
			direction: 'UPSTREAM',
			type: 'TEXT'
		},
		zip_code_extension: {
			direction: 'UPSTREAM',
			type: 'TEXT'
		}
	},
	triggers: {
		'request_mailing_address_type_details': {
			action: 'requestMailingAddressTypeDetails',
			type: 'HTML',
			preventDefault: true
		},'save_mailing_address_changes': {
			action: 'saveMailingAddressChanges',
			type: 'HTML',
			preventDefault: true
		},
		'cancel': {
			action: 'cancelMailingAddressChanges',
			type: 'HTML',
			preventDefault: true
		}
	}
});
