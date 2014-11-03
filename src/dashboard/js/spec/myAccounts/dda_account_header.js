define([], function() { return {
	"name": "DDA_ACCOUNT_HEADER",
	"data": {
		"account_name": {
			"type": "Description"
		},
		"account_mask_number": {
			"type": "AccountMaskNumber"
		},
		"account_number": {
			"type": "AccountNumber"
		},
		"routing_number": {
			"type": "RoutingNumber"
		},
		"account_balance": {
			"type": "Money"
		},
		"interest_rate": {
			"type": "Percentage"
		},
		"interest_year_till_date": {
			"type": "Money"
		},
		"number_of_withdrawals_this_period": {
			"type": "Numbers"
		},
		"interest_for_year": {
			"type": "Date"
		},
		"account_available_balance": {
			"type": "Money"
		},
		"overdraft_protection_enrollment_status": {
			"type": "OnOff"
		},
		"debit_card_coverage_enrollment_status": {
			"type": "OnOff"
		},
		"paperless_statements_enrollment_status": {
			"type": "OnOff"
		}
	},
	"actions": {
		"request_account_summary": true,
		"request_account_header_details": true,
		"setup_overdraft_protection_preferences": true,
		"setup_debit_card_coverage_preferences": true,
		"setup_paperless_statements_preferences": true,
		"request_overdraft_protection_details": true,
		"request_debit_card_coverage_details": true,
		"request_paperless_statements_details": true
	},
	"settings": {
		"interest_rate_label": true,
		"interest_year_till_date_label": true,
		"account_number_label": true,
		"routing_number_label": true,
		"account_balance_label": true,
		"account_available_balance_label": true,
		"number_of_withdrawals_this_period_label": true,
		"overdraft_protection_enrollment_status_label": true,
		"debit_card_coverage_enrollment_status_label": true,
		"paperless_statements_enrollment_status_label": true,
		"setup_overdraft_protection_preferences_label": true,
		"setup_debit_card_coverage_preferences_label": true,
		"setup_paperless_statements_preferenceslabel": true,
		"request_overdraft_protection_details_label": true,
		"request_debit_card_coverage_details_label": true,
		"request_paperless_statements_details_label": true
	}
}; });
