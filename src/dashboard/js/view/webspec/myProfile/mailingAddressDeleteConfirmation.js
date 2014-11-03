define({
	name: 'MY_PROFILE_ADDRESS_DELETE_CONFIRMATION',
	bindings: {},
	triggers: {
		'deleteAddress': {
			action: 'deleteAddress',
			type: 'HTML',
			event: 'click',
			preventDefault: true
		},
		'doNotDeleteAddress': {
			action: 'doNotDeleteAddress',
			type: 'HTML',
			event: 'click',
			preventDefault: true
		}
	}
});
