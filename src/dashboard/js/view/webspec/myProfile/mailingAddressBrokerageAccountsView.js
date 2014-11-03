define({
	name: 'MY_PROFILE_BROKERAGE_ACCOUNTS',
	bindings: {},
	triggers: {
		'edit': {
			action: 'changeMailingAddress',
			type: 'HTML',
			preventDefault: true
		}
	}
});
