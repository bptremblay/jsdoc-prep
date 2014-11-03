define([], function() {
	return {
		"name": "CANCEL_MERCHANT_BILL_PAYMENT",
		"data": {
			"transaction_amount": {
				"type": "Money"
			},
			"transaction_notification_date": {
				"type": "Date"
			},
			"memo": {
				"type": "Description"
			},
			"payee_name": {
				"type": "Description"
			}
		},
		"actions": {
			"do_not_cancel_merchant_bill_payment": true,
			"confirm_cancel_merchant_bill_payment": true
		},
		"settings": {
			"cancel_merchant_bill_payment_message": true,
			"memo_label": true,
			"optional_label": true,
			"memo_advisory": true,
			"confirm_cancel_merchant_bill_payment_label": true,
			"do_not_cancel_merchant_bill_payment_label": true
		}
	};
});
