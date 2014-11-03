define([], function() { return {
	"name": "UPDATE_FUNDING_ACCOUNTS",
	"data": {
		"funding_accounts": {
			"type": "list",
			"items": {
				"funding_account_display_name": "Description",
				"primary_designation": "OnOff",
				"funding_account_nickname": "Description"
			}
		}
	},
	"actions": {
		"update_primary_designation": true,
		"update_funding_account": true,
		"delete_funding_account": true,
		"cancel_update_funding_account": true,
		"save_update_funding_account": true,
		"close_primary_designation_advisory": true,
	},
	"state": {
		"funding_account_updated": true
	},
	"settings": {
		"internal_accounts_header": true,
		"external_accounts_header": true,
		"primary_designation_label": true,
		"primary_designation_advisory": true,
		"funding_account_display_name_label": true,
		"funding_account_nickname_advisory": true,
		"funding_account_nickname_error": true,
		"update_funding_account_label": true,
		"delete_funding_account_label": true,
		"cancel_update_funding_account_label": true,
		"save_update_funding_account_label": true,
		"no_delete_funding_account_message": true,
		"confirm_delete_funding_account_message": true,
		"exit_delete_funding_account_label": true,
		"confirm_funding_account_deletion_message": true,
		"confirm_funding_account_deletion_label": true,
		"cancel_funding_account_deletion_label": true
	}
}; });
