define([], function() { return {
  "name": "PAYMENT_MENU",
  "data": {
    "payment_menu_options": {
      "type": "List",
      "itemType": "Description"
    }
  },
  "actions": {
    "pay_bills": true,
    "request_payment_activity": true,
    "add_funding_accounts": true,
    "manage_funding_accounts": true
  },
  "states": {
    "payment_menu_option_selected": true
  },
  "settings": {
    "pay_bills_navigation": true,
    "request_payment_activity_navigation": true,
    "payment_menu_additional_options_header": true,
    "add_funding_accounts_label": true,
    "manage_funding_accounts_label": true
  }


}; });
