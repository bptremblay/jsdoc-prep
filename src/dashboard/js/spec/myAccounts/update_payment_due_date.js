define([], function() {
    return {
        "name": "UPDATE_PAYMENT_DUE_DATE",
        "data": {
            "account_name": {
                "type": "Description"
            },
            "account_mask_number": {
                "type": "Description"
            },
            "payment_due_date": {
                "type": "Date"
            },
            "primary_borrower_name": {
                "type": "Description"
            },
            "next_payment_due_date_options": {
                "type": "List",
                "itemType": "Numbers"
            },
            "next_payment_due_date": {
                "type": "Date"
            }
        },
        "actions": {
            "initiate_update_payment_due_date": true,
            "verify_update_payment_due_date": true,
            "confirm_update_payment_due_date": true,
            "cancel_update_payment_due_date": true, // action to cancel the workflow in middle
            "exit_update_payment_due_date": true // action to exit the workflow post completion
        },
        "settings": {
            "next_label": true,
            "cancel_label": true,
            "previous_label": true,
            "exit_label": true,
            // begin
            "update_payment_due_date_disclaimer": true,
            // initiate
            "initiate_update_payment_due_date_header": true,
            "initiate_update_payment_due_date_message": true,
            "payment_due_date_message": true,
            "not_able_to_update_payment_due_date_header": true,
            "not_able_to_update_payment_due_date_message": true,
            "day_of_month_label": true, //of every month
            "day_of_month": true, //for 5th , 15th
            // Verify
            "verify_update_payment_due_date_header": true,
            "verify_update_payment_due_date_message": true,
            "verify_update_payment_due_date_advisory": true,
            "payment_due_date_label": true,
            "primary_borrower_name_label": true,
            "next_payment_due_date_label": true,
            "initiate_update_payment_due_date_label": true,
            // Confirm
            "account_display_name_label": true,
            "confirm_update_payment_due_date_header": true,
            "confirm_update_payment_due_date_message": true,
            "confirm_update_payment_due_date_advisory": true,
            "confirm_update_payment_due_date_label": true,
        }
    };
});
