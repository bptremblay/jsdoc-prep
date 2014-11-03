define(function(require) {

    return function MegaMenuController() {
        var menuTrans = require('dashboard/service/languageMapper').getLocaleMessage('menuLablel'),
            observable = require('blue/observable'),
            controllerChannel = require('blue/event/channel/controller'),
            megaMenuSpec = require('dashboard/spec/sideMenu/megaMenu'),
            megaMenuMethods = require('dashboard/component/sideMenu/megaMenu');

        this.init = function() {
            this.model = observable.Model.combine({
                'megaMenuComponent': {
                    logoUrl: '',
                    navigation: [{
                        label: menuTrans.DOCUMENTS,
                        active: true,
                        name: 'DOCUMENTS',
                        linkTo: 'javascript:;'
                    }, {
                        label: menuTrans.CONTACT_DETAILS,
                        active: false,
                        name: 'CONTACT_DETAILS',
                        linkTo: 'javascript:;'
                    }, {
                        label: menuTrans.DEMOS,
                        active: false,
                        name: 'DEMOS',
                        linkTo: 'javascript:;'
                    }, {
                        label: menuTrans.LEGAL_DETAILS,
                        active: false,
                        name: 'LEGAL_DETAILS',
                        linkTo: 'javascript:;'
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
                }
            });

            // this.components = {};
            // this.components.megaMenuComponent = new MegaMenuComponent('megaMenuComponent', megaMenuModel, {
            //     context: this
            // });

            this.register.components(this, [{
                name: 'megaMenuComponent',
                model: this.model.lens('megaMenuComponent'),
                spec: megaMenuSpec,
                methods: megaMenuMethods
            }]);

            //TEMPORARY - this action will be triggered from accounts controller when summary account are loaded
            //eventually this should be replaced with the ability to directly trigger megaMenuComponent's
            //updateLogo action from accounts controller
            controllerChannel.on({
                'updateMegaMenuLogo': function(data) {
                    this.components.megaMenuComponent.updateLogo(data.brandId);
                }.bind(this),
                'initMegaMenu': function(params) {
                    this.index(params);
                }.bind(this)
            });
        };

        /**
         * Function for default action
         * @function index
         * @memberOf module:Indexthis
         */
        this.index = function() {

            return ['sideMenu/megaMenu', this.model];
        };


    };
});
