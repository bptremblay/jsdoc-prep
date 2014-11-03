define({
	name: 'CUSTOMER_SITE_MESSAGES',
	bindings: {
		site_message_description: {
			field: 'site_message_description',
			direction: 'DOWNSTREAM',
			type: 'HTML'
		},
		site_message_brief: {
			field: 'site_message_brief',
			direction: 'DOWNSTREAM',
			type: 'HTML'
		},
		site_message_action_text: {
			field: 'site_message_action_text',
			direction: 'DOWNSTREAM',
			type: 'HTML'
		}
	},
	triggers: {
		close_customer_site_messaging: {
			action: 'close_customer_site_messaging',
			event: 'click',
			type: 'BUTTON'
		},
		expand_message: {
			action: 'expand_message',
			event: 'click',
			type: 'HTML'
		},
		collapse_message: {
			action: 'collapse_message',
			event: 'click',
			type: 'HTML'
		}
	}
});
