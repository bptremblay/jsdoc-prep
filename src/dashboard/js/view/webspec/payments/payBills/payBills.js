define({
    name: 'payBills',
    bindings: {},
    triggers: {
        'pay_bills_cancel': {
            action: 'pay_bills_cancel',
            'type': 'ANCHOR',
            event: 'click'
        },
        'pay_bills_next': {
            action: 'pay_bills_next',
            'type': 'ANCHOR',
            event: 'click'
        }
    }
});