define({
    name: 'PAYMENT_MENU',
    bindings: {
        navigation: {
            field: 'payment_menu_options',
            direction: 'DOWNSTREAM',
            type: 'HTML'
        }
    },
    triggers: {
        requestPaymentActivity: {
            action: 'request_payment_activity"',
            type: 'HTML'
        },
        sendMoney: {
        	action: 'send_money',
        	event: 'click',
        	type: 'HTML'
        },
        manageFundingAccounts: {
        	action: 'manageFundingAccounts',
        	event: 'click',
        	type: 'HTML'
        }
    }
});
