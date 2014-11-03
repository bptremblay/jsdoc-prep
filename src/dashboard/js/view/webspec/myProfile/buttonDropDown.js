define({
	'name': 'BUTTON_DROPDOWN',
	'bindings': {},
	triggers: {
		'toggle':{
			action: 'toggle',
			type: 'HTML'
		},
		'list_option':{
			action: 'option_click',
			type: 'HTML'
		},
		'trigger_keydown':{
			action: 'trigger_keydown',
			type: 'HTML'
		},
		'option_keydown': {
			action: 'option_keydown',
			type: 'HTML'
		}
		// 'document:click':{
		// 	action: 'hide'
		// }
	}
});
