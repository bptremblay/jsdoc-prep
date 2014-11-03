define({
    name: 'CUSTOMER_CONVERSATION_MESSAGES_HEADER',
    bindings: {
    	conversation_message_header: {
        	field: 'conversation_message_header',
            type: 'HTML',
            direction: 'DOWNSTREAM'
        },
        total_conversation_messages: {
            field: 'total_conversation_messages',
            type: 'HTML',
            direction: 'DOWNSTREAM'
        },
        total_conversation_messages_ada: {
            field: 'total_conversation_messages_ada',
            type: 'HTML',
            direction: 'DOWNSTREAM'
        },
        conversation_message_display_ada: {
            field: 'conversation_message_display_ada',
            type: 'HTML',
            direction: 'DOWNSTREAM'
        }

    },
	triggers: {
        toggle_conversation_messages: {
            action: 'toggleConversationMessages',
            preventDefault: true
        }
	}
});
