define({
	name: 'ADD_FUNDING_ACCOUNT',
	bindings: {

        routing_number: {
            type: 'TEXT',
            field: 'routing_number',
            direction: 'BOTH'
        },

        account_number:{
        	type : 'TEXT',
        	field: 'account_number',
        	direction: 'BOTH'
        },

        confirmed_account_number:{
        	type: 'TEXT',
        	field: 'confirmed_account_number',
        	direction: 'BOTH'
        },

        account_nickname:{
        	type: 'TEXT',
        	field: 'account_nickname',
        	direction: 'BOTH'
        }

	},

	triggers: {

		cancel_add_funding_account: {
			action: 'cancel_add_funding_account',
			event: 'click',
			type: 'HTML'
		},

		add_funding_account: {
			action: 'add_funding_account',
			event: 'click',
			type: 'HTML'
		},

		request_routing_number_help_message: {
			action: 'request_routing_number_help_message',
			event: 'click',
			type: 'HTML'
		},

		exit_routing_number_help_message: {
			action: 'exit_routing_number_help_message',
			event: 'click',
			type: 'HTML'
		},

		validateRoutingNumberFocusOut: {
			action: 'validate_routing_number_focus_out',
			event: 'focusout',
			type: 'TEXT'
		},

		validateRoutingNumberFocus: {
			action: 'validate_routing_number_focus',
			event: 'click',
			type: 'TEXT'
		},

		validateAccountNumberFocusOut: {
			action: 'validate_account_number_focus_out',
			event: 'focusout',
			type: 'TEXT'
		},

		validateAccountNumberFocus: {
			action: 'validate_account_number_focus',
			event: 'click',
			type: 'TEXT'
		},

		validateConfirmedAccountNumberFocusOut: {
			action: 'validate_confirmed_account_number_focus_out',
			event: 'focusout',
			type: 'TEXT'
		},

		validateConfirmedAccountNumberFocus: {
			action: 'validate_confirmed_account_number_focus',
			event: 'click',
			type: 'TEXT'
		},

		validateAccountNicknameFocusOut: {
			action: 'validate_account_nickname_focus_out',
			event: 'focusout',
			type: 'TEXT'
		},

		validateAccountNicknameFocus: {
			action: 'validate_account_nickname_focus',
			event: 'click',
			type: 'TEXT'
		},

		validateFormFields:{
			action: 'validate_form_fields',
			event: 'focusout',
			type: 'TEXT'
		}

	}

});
