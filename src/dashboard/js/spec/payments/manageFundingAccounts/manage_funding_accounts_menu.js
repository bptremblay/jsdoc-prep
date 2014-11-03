/*define([], function() { return {
	"name": "MANAGE_PAY_ACCOUNTS",
	"data": {},

	"actions": {
		"add_payment_account": true,
		"edit_payment_account": true
	},

	"states": {
		"add_payment_account_selected": true,
		"edit_payment_account_selected": true
	},
	"settings": {}
	};
});
*/


define([], function() { return {
  "name": "MANAGE_FUNDING_ACCOUNTS_MENU",
  "data": null,
  "actions": {
    "update_funding_accounts": true,
    "add_funding_account": true
  },
  "states": {
    "manage_funding_accounts_option_selected": true
  },
  "settings": {
    "manage_funding_accounts_header": true,
    "update_funding_accounts_label": true,
    "add_funding_account_label": true
  }
}; });
