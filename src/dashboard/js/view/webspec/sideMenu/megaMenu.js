define({
    name: 'MEGAMENU',
    bindings: {
        navigation: {
            field: 'navigation',
            direction: 'DOWNSTREAM'
        },
        logoUrl: {
            field: 'logoUrl',
            direction: 'DOWNSTREAM'
        }
    },
    triggers: {
        atmPref: {
            action: 'atm_pref',
            event: 'click'
        },
        messageCenter: {
            action: 'message_center',
            event: 'click'
        }
    }
});