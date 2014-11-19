define(function(require) {

    return function MegaMenuController() {
        require('dashboard/service/languageMapper').call(this);

        var menuTrans = this.getLocaleMessage('menuLablel'),
            observable = require('blue/observable'),
            megaMenuSpec = require('dashboard/spec/sideMenu/megaMenu'),
            megaMenuMethods = require('dashboard/component/sideMenu/megaMenu');

        this.init = function() {
            this.model = observable.Model.combine({
                'megaMenuComponent': {}
            });
        };

        /**
         * Function for default action
         * @function index
         * @memberOf module:Indexthis
         */
        this.index = function() {
            var magaMenuData = {
                logoUrl: '',
                navigation: [{
                    label: menuTrans.DOCUMENTS,
                    active: true,
                    name: 'DOCUMENTS',
                    linkTo: ''
                }, {
                    label: menuTrans.CONTACT_DETAILS,
                    active: false,
                    name: 'CONTACT_DETAILS',
                    linkTo: ''
                }, {
                    label: menuTrans.DEMOS,
                    active: false,
                    name: 'DEMOS',
                    linkTo: ''
                }, {
                    label: menuTrans.LEGAL_DETAILS,
                    active: false,
                    name: 'LEGAL_DETAILS',
                    linkTo: ''
                }, {
                    label: menuTrans.ATM_PREFERENCES,
                    active: false,
                    linkTo: 'javascript:;',
                    target: true,
                    name: 'ATM_PREFERENCES',
                    id: 'atm-pref'
                }, {
                    label: menuTrans.MESSAGE_CENTER,
                    active: false,
                    linkTo: 'javascript:;',
                    target: true,
                    name: 'MESSAGE_CENTER',
                    id: 'message-center'
                }, {
                    label: menuTrans.CONTACT_US,
                    active: false,
                    name: 'CONTACT_US',
                    linkTo: 'https://chaseonlineq4.chase.com/secure/CustomerCenter.aspx',
                    target: true
                }]
            };
            this.register.components(this, [{
                name: 'megaMenuComponent',
                model: observable.Model.combine(magaMenuData),
                spec: megaMenuSpec,
                methods: megaMenuMethods
            }]);

            return [
                [this.components.megaMenuComponent, 'sideMenu/megaMenu', {
                    target: '#mega-menu',
                    react: true,
                }]];
        };
    };
});