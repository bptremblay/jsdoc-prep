define([], function() {
    return {
        "name": "HEL_ACCOUNT_ACTIVITY",
        "data": {
            "transactions": {
                "type": "List",
                "items": {
                    "transaction_description": "Description",
                    "transaction_posted_date": "Date",
                    "transaction_amount": "Money",
                    "principal_amount_balance": "Money",
                    "principal_payment": "Money",
                    "interest_payment": "Money",
                    "transaction_fees_payment": "Money",
                    "check_number": "Description"
                }
            }
        },
        "actions": {
            "request_account_activity": true,
            "sort_by": true,
            "export_account_activity": true,
            "print_account_activity": true,
            "toggle_account_activity_display": true
        },
        "states": {
            "view_displayed": true
        },
        "settings": {
            "transaction_group_posted_label": true,
            "transaction_posted_date_label": true,
            "transaction_description_label": true,
            "transaction_amount_label": true,
            "principal_payment_label": true,
            "interest_payment_label": true,
            "transaction_fees_payment_label": true,
            "principal_amount_balance_label": true,
            "see_more_transactions_label": true,
            "switch_to_simple_view_label": true,
            "switch_to_detailed_view_label": true,
            "end_of_account_activity_label": true,
            "error_message": true,
            "check_number_label": true,
            "not_available_label": true
        }
    };
});
