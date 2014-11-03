define({

    name: 'TOPMENU',
    bindings: {
        navigation: {
            field: 'navigation',
            direction: 'DOWNSTREAM'
        }
    },
    triggers: {
        navigation: {
            action: 'topMenuNavigation'
        }
    }
});