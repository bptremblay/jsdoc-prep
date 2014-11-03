define([], function() { return {
	"name": "MANAGE_FUNDING_ACCOUNTS_HEADER",
	"data": {
		"account_display_name": {
			"type": "List",
			"itemType": "Description"
		}
	},
	"actions": {
		"request_accounts": true,
		"exit_manage_funding_accounts": true
	},
	"settings": {
		"account_display_name_label": true,
		"update_primary_funding_account_message": true,
		"update_funding_account_message": true,
		"no_funding_accounts_message": true,
		"add_funding_account_message": true,
		"delete_funding_account_message": true
	}
}; });
