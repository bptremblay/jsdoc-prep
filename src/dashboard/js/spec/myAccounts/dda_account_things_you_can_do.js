define([], function() { return {
	"name": "DDA_ACCOUNT_THINGS_YOU_CAN_DO",
	"data": {
		"debit_card_coverage_settings_available": {
      "type": "OnOff"
    }
	},
	"actions": {
		"request_things_you_can_do": true,
		"exit_things_you_can_do": true,
		"request_account_details": true,
		"request_account_statements": true,
		"request_account_services_details": true,
		"request_forms_and_documents": true,
		"update_overdraft_protection_service_settings": true,
		"update_debit_card_coverage_settings": true,
		"update_overdraft_alerts_settings": true,
		"request_account_faqs": true,
		"update_account_settings_and_preferences": true
	},
	"states": {
		"things_you_can_do_option_selected": true,
		"things_you_can_do_header_minimized_state": true
	},
	"settings": {
		"things_you_can_do_header": true,
		"request_account_details_label": true,
		"request_account_statements_label": true,
		"request_account_services_details_label": true,
		"request_forms_and_documents_label": true,
		"update_overdraft_protection_service_settings_label": true,
		"update_debit_card_coverage_settings_label": true,
		"update_overdraft_alerts_settings_label": true,
		"request_account_faqs_label": true,
		"manage_account_settings_and_preferences_label": true
	}
}; });
