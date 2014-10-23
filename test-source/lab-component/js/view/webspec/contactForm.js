define({
    name: 'CONTACTFORM',
    bindings: {
        chkBox: {
            direction: 'BOTH'
        },
        dropDown: {
            direction: 'BOTH'
        },
        txtBox: {
            direction: 'BOTH'
        }
    },
    triggers: {
        'submit_details': {
            action: 'submit'
        }
    }
});
