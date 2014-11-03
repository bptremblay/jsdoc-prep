define({
    name: 'CUSTOMER_CONVERSATION_MESSAGES',
	bindings: {
		conversationMessageActions: {
			direction: 'DOWNSTREAM'
		}
	},
    triggers: {
        exit_conversation_message: {
        	action: 'exitConversationMessage',
            preventDefault: true
        },
		select_conversation_message_action: {
        	action: 'selectConversationMessageAction',
            preventDefault: true
        },
        exit_conversation_message_error: {
            action: 'exitConversationMessageError',
            preventDefault: true
        },
        request_conversation_message: {
        	action: 'requestConversationMessage',
        	preventDefault: true
        }
    }
});
