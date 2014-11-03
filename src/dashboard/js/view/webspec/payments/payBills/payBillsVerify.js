define({
    name: 'payBills_VERIFY',
    bindings: {},
    triggers: {
        'pay_bills_cancel': {
            action: 'pay_bills_cancel',
            'type': 'ANCHOR',
            event: 'click'
        },
        'pay_bills_prev': {
            action: 'pay_bills_prev',
            'type': 'ANCHOR',
            event: 'click'
        },
        'pay_bills_verify': {
            action: 'pay_bills_verify',
            'type': 'ANCHOR',
            event: 'click'
        }
    }
});