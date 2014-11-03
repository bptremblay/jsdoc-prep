define([], function() { return {
	"name": "ADD_FUNDING_ACCOUNT",
	"data": {

	    "routing_number": {
	      "type": "Number"
	    },

	    "account_number": {
	    	"type": "Number"
	    },

	    "confirmed_account_number": {
	    	"type": "Number"
	    },

	    "account_nickname": {
	    	"type": "Description"
	    }

	},

	/************************************************
	* ACTIONS MAP TO FUNCTIONS INSIDE
	* THE COMPONENT AND THEY ARE CAMELCASE
	* ex. add_payment_account = addPaymentAccount()
	************************************************/
	"actions": {
		"cancel_add_funding_account":true,
		"add_funding_account":true,
		"request_routing_number_help_message":true,
		"exit_routing_number_help_message":true
	},

	"states": {},

	"settings": {
		"add_funding_account_message": true,
  		"check_image_front": true,
  		"routing_number_label": true,
  		"routing_number_help_message": true,
  		"routing_number_error": true,
  		"account_number_label": true,
  		"account_number_error": true,
  		"confirmed_account_number_label": true,
  		"confirmed_account_number_error": true,
  		"account_nickname_label": true,
  		"account_nickname_advisory": true,
  		"account_nickname_error": true,
  		"cancel_add_funding_account_label": true,
  		"add_funding_account_label": true
	}
	};
});
