define({
    name: 'payBills_CONFIRM',
    bindings: {},
    triggers: {
        'pay_bills_close': {
            action: 'pay_bills_close',
            'type': 'ANCHOR',
            event: 'click'
        },
        'another_pay_bills': {
            action: 'another_pay_bills',
            'type': 'ANCHOR',
            event: 'click'
        }
    }
});