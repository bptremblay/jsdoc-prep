define([], function() { return {
	"name": "PAYMENT_ACTIVITY",
	"data": {
		"account_display_name": {
			"type": "List",
			"itemType": "Description"
		},
		"transactions": {
			"type": "List",
			"items": {
				"transaction_date": "Date",
				"transaction_status": "Description",
				"transaction_amount": "Money",
				"transaction_description": "Description",
				"funding_account_display_name": "Description",
				"transaction_number": "Description"
			}
		},
		"automatic_payment_enrollment_status": {
			"type": "OnOff"
		}
	},
	"actions": {
		"request_account_activity": true,
		"request_transaction_details": true,
		"toggle_transaction_details": true,
		"print_transaction_details": true,
		"cancel_transaction": true
	},
	"settings": {
		"request_account_activity_label": true,
		"auto_pay_label": true,
		"transaction_date_label": true,
		"transaction_scheduled_date_label": true,
		"transaction_status_label": true,
		"transaction_amount_label": true,
		"transaction_details_label": true,
		"request_transaction_details_label": true,
		"account_display_name_label": true,
		"transaction_number_label": true,
		"automatic_payment_enrollment_status_label": true,
		"request_transaction_details_label": true,
		"hide_transaction_details_label": true,
		"cancel_transaction_label": true,
		"transaction_group_one_time_payment_label": true,
		"no_activity_message": true
	}
}; });
