define({
	name: 'CUSTOMER_CONVERSATION_MESSAGES_FOOTER',
	bindings: {},
	triggers: {
        dismiss_all_messages: {
            action: 'dismiss_all_messages',
            preventDefault: true
        },
		hide_all_messages: {
            action: 'hide_all_messages',
            preventDefault: true
        },
		show_more_messages: {
            action: 'show_more_messages',
            preventDefault: true
        }
	}
});
