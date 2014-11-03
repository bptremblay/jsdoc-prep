define({
    name: 'MY_INFO_MENU',
    bindings: {
        fullName: {
            direction: 'DOWNSTREAM'
        }
    },
    triggers: {
        logOutOnlineBanking: {
            action: 'logOutOnlineBanking',
            preventDefault: true
        },
        requestMyProfile: {
            action: 'requestMyProfile',
            preventDefault: true
        },
        requestMyInfoMenu: {
            action: 'requestMyInfoMenu'
        },
        exitMyInfoMenu: {
            action: 'exitMyInfoMenu'
        }
    }
});
