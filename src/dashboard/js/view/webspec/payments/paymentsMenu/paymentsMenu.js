define({
    name: 'PAYMENT_MENU',
    bindings: {
    	paymentMenuOptions: {
    		direction: 'BOTH',
    		field: 'payment_menu_options'
    	}
    },
    triggers: {
    	requestPaymentActivity: {
            action: 'request_payment_activity'
        },
        payBills: {
        	action: 'payBills'
        },
        sendMoney: {
        	action: 'sendMoney'
        },
        addFundingAccounts: {
        	action: 'addFundingAccounts'
        },
        manageFundingAccounts: {
        	action: 'manageFundingAccounts'
        },
        paymentMenuAdditionalOptions: {
        	action: 'paymentMenuAdditionalOptions'
        },
        paymentMenuAdditionalOptions: {
        	action: 'paymentMenuAdditionalOptions'
        },
        menuClickHandler: {
        	action: 'menuClickHandler',
        	preventDefault: true
        }

    }
});
