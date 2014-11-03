define({
	name : 'QPDUPLICATE',
	bindings:{

	},
	triggers:{
		duplicate_next_button: {
			type: 'BUTTON',
			action: 'send_overlay'
		},
		duplicate_cancel_button: {
			type: 'BUTTON',
			action: 'cancel_overlay'
		}
	}
});
