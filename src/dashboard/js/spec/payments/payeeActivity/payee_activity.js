define([], function() {
	return {
		"name": "PAYEE_ACTIVITY",
		"data": {
			"payee_activity_transactions": {
				"type": "List",
				"items": {
					"transaction_initiation_date": "Date",
					"transaction_due_date": "Date",
					"transaction_status": "Description",
					"transaction_amount": "Money",
					"funding_account_display_name": "Description",
					"memo": "Description",
					"transaction_status_detail": "Description",
					"transaction_due_date_detail": "Description",
					"transaction_number": "Number",
					"submitted_by": "Description",
					"updated_by": "Description",
					"approved_by": "Description",
					"transaction_modification_status": "Description"
				}
			},
			"payee_name": {
				"type": "Description"
			},
			"payee_id": {
				"type": "Number"
			},
			"payment_id": {
				"type": "Number"
			}
		},
		"actions": {
			"show_transactions": true,
			"request_transaction_details": true,
			"hide_transaction_details": true,
			"update_transaction": true,
			"cancel_transaction": true
		},
		"settings": {
			"payee_activity_header": true,
			"payee_activity_message": true,
			"payee_activity_legal": true,
			"transaction_initiation_date_label": true,
			"transaction_due_date_label": true,
			"transaction_amount_label": true,
			"transaction_status": true,
			"transaction_status_label": true,
			"transaction_status_advisory": true,
			"transaction_status_detail": true,
			"transaction_status_detail_label": true,
			"transaction_processing_delivery_method": true,
			"none_label": true,
			"not_available_label": true,
			"no_payee_activity": true,
			"see_more_label": true,
			"update_transaction_label": true,
			"cancel_transaction_label": true,
			"request_transaction_details_label": true,
			"hide_transaction_details_label": true,
			"send_inquiry_label": true,
			"proof_of_payment_label": true,
			"transaction_status_due_date_detail_label": true,
			"funding_account_display_name_label": true,
			"memo_label": true,
			"submitted_by_label": true,
			"updated_by_label": true,
			"approved_by_label": true,
			"transaction_number_label": true,
			"cancel_merchant_bill_payment_confirmation_message": true,
			"update_merchant_bill_payment_confirmation_message": true
		}
	};
});
