define(function() {
    var context = null;

    return {
        init: function() {
            context = this.settings.context;
        },
        documentClick: function() {
            var menuTrans = context.languageMapper.getLocaleMessage('menuLablel'),
                modelData = {
                    navigation: [{
                        label: menuTrans.DOCUMENTS,
                        active: true,
                        linkTo: '#'
                    }, {
                        label: menuTrans.CONTACT_DETAILS,
                        active: false,
                        linkTo: '#'
                    }, {
                        label: menuTrans.DEMOS,
                        active: false,
                        linkTo: '#'
                    }, {
                        label: menuTrans.LEGAL_DETAILS,
                        active: false,
                        linkTo: '#'
                    }, {
                        label: menuTrans.ATM_PREFERENCES,
                        active: false,
                        linkTo: '#'
                    }, {
                        label: menuTrans.MESSAGE_CENTER,
                        active: false,
                        linkTo: '#'
                    }, {
                        label: menuTrans.CONTACT_US,
                        active: false,
                        linkTo: '#'
                    }]
                };
            context.model.lens('megaMenuComponent').set(modelData);
        },
        contactDetailsClick: function() {
            var menuTrans = context.languageMapper.getLocaleMessage('menuLablel'),
                modelData = {
                    navigation: [{
                        label: menuTrans.DOCUMENTS,
                        active: true,
                        linkTo: '#'
                    }, {
                        label: menuTrans.CONTACT_DETAILS,
                        active: false,
                        linkTo: '#'
                    }, {
                        label: menuTrans.DEMOS,
                        active: false,
                        linkTo: '#'
                    }, {
                        label: menuTrans.LEGAL_DETAILS,
                        active: false,
                        linkTo: '#'
                    }, {
                        label: menuTrans.ATM_PREFERENCES,
                        active: false,
                        linkTo: '#'
                    }, {
                        label: menuTrans.MESSAGE_CENTER,
                        active: false,
                        linkTo: '#'
                    }, {
                        label: menuTrans.CONTACT_US,
                        active: false,
                        linkTo: '#'
                    }]
                };
            context.model.lens('megaMenuComponent').set(modelData);
        },
        demosClick: function() {
            var menuTrans = context.languageMapper.getLocaleMessage('menuLablel'),
                modelData = {
                    navigation: [{
                        label: menuTrans.DOCUMENTS,
                        active: true,
                        linkTo: '#'
                    }, {
                        label: menuTrans.CONTACT_DETAILS,
                        active: false,
                        linkTo: '#'
                    }, {
                        label: menuTrans.DEMOS,
                        active: false,
                        linkTo: '#'
                    }, {
                        label: menuTrans.LEGAL_DETAILS,
                        active: false,
                        linkTo: '#'
                    }, {
                        label: menuTrans.ATM_PREFERENCES,
                        active: false,
                        linkTo: '#'
                    }, {
                        label: menuTrans.MESSAGE_CENTER,
                        active: false,
                        linkTo: '#'
                    }, {
                        label: menuTrans.CONTACT_US,
                        active: false,
                        linkTo: '#'
                    }]
                };
            context.model.lens('megaMenuComponent').set(modelData);
        },
        legalDetClick: function() {
            var menuTrans = context.languageMapper.getLocaleMessage('menuLablel');
            var modelData = {
                navigation: [{
                    label: menuTrans.DOCUMENTS,
                    active: true,
                    linkTo: '#'
                }, {
                    label: menuTrans.CONTACT_DETAILS,
                    active: false,
                    linkTo: '#'
                }, {
                    label: menuTrans.DEMOS,
                    active: false,
                    linkTo: '#'
                }, {
                    label: menuTrans.LEGAL_DETAILS,
                    active: false,
                    linkTo: '#'
                }]
            };
            context.model.lens('megaMenuComponent').set(modelData);
        },
        atmPref: function() {
            context.state(context.settings.classicAtmPrefUrl);
        },
        messageCenter: function() {
            context.state(context.settings.classicMsgCenterUrl);
        },
        updateLogo: function(logoUrl) {
            context.model.lens('megaMenuComponent.logoUrl').set(context.languageMapper.getLocaleMessage('LOGO')[logoUrl ? logoUrl : 'CONSUMER']);
        }
    };
});