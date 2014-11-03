define({
	name: 'MY_PROFILE_ADDRESS_ADDITION_VERIFICATION',
	bindings: {},
	triggers: {
		'addAddress': {
			action: 'addAddress',
			type: 'HTML',
			event: 'click',
			preventDefault: true
		},
		'doNotAddAddress': {
			action: 'doNotAddAddress',
			type: 'HTML',
			event: 'click',
			preventDefault: true
		}
	}
});
