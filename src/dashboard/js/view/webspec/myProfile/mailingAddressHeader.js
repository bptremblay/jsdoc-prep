define({
	name: 'MY_PROFILE_ADDRESS_HEADER',
	bindings: {},
	triggers: {
		'addPermanentAddress': {
			action: 'addPermanentMailingAddress',
			type: 'HTML',
			event: 'click',
			preventDefault: true
		},
		'addTemporaryAddress': {
			action: 'addTemporaryMailingAddress',
			type: 'HTML',
			event: 'click',
			preventDefault: true
		}

	}
});
