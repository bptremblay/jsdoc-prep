define([], function() {
	return {
		'name': 'PAYMENT_ACTIVITY_MENU',
		'data': {},
		'actions': {
			"request_credit_card_payment_activity": true,
			"request_mortgage_payment_activity": true,
			"request_money_transfer_activity": true
		},
		'states': {
			"payment_activity_menu_option_selected": true
		},
		'settings': {
			"pay_bills_header": true,
			"request_credit_card_payment_activity_label": true,
			"request_mortgage_payment_activity_label": true,
			"request_money_transfer_activity_label": true,
			"view_your_payment_activity_label": true,
 			"payment_activity_selection_message": true
		}
	};
});
