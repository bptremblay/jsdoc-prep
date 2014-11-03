define({
	'name': 'CONTEXTUAL_HELP',
	'bindings': {},
	'triggers': {
		'click': {
			action: 'clickAndStick',
			type: 'HTML'
		},
		'mouseOver': {
			action: 'show',
			type: 'HTML'
		},
		'mouseOut': {
			action: 'hide',
			type: 'HTML'
		},
		'close': {
			action: 'clickAndStick',
			type: 'HTML',
			preventDefault: true
		}
		// 'document:click': {
		// 	action: 'closeClickAndStick'
		// }
	}
});
