/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module Indexthis
 **/
define(function(require) {

    return function HeaderController() {

        var observable = require('blue/observable'),
            MyInfoSpec = require('dashboard/spec/header/myInfo'),
            MyInfoMethods = require('dashboard/component/header/myInfo'),
            ModuleHeaderSpec = require('dashboard/spec/header/moduleHeader'),
            ModuleHeaderMethods = require('dashboard/component/header/moduleHeader'),
            TopMenuSpec = require('dashboard/spec/header/topMenu'),
            TopMenuMethods = require('dashboard/component/header/topMenu'),
            MyNotificationsSpec = require('dashboard/spec/conversationDeck/myNotifications'),
            MyNotificationsMethods = require('dashboard/component/conversationDeck/myNotifications'),
            SearchSpec = require('dashboard/spec/conversationDeck/search'),
            SearchMethods = require('dashboard/component/conversationDeck/search'),
            PaymentMenuSpec = require('dashboard/spec/payments/paymentsMenu/paymentsMenu'),
            PaymentMenuMethods = require('dashboard/component/payments/paymentsMenu/paymentsMenu'),
            HeaderContainerSpec = require('dashboard/spec/header/headerContainer'),
            HeaderContainerMethods = require('dashboard/component/header/headerContainer'),
            dynamicContentUtil = require('common/utility/dynamicContentUtil');

        this.init = function() {

            this.model = observable.Model.combine({
                'myInfoComponent': {},
                'topMenuComponent': {},
                'myNotificationsComponent': {},
                'searchData': {},
                'paymentMenuComponent': {},
                'moduleHeaderComponent': {}
            });
        };

        /**
         * Function for default action
         * @function index
         * @memberOf module:Indexthis
         */
        this.index = function() {

            var paymentMenuModel = this.settings.get('paymentMenuInstance'),
                topMenuModel = this.settings.get('topMenuInstance'),
                notificationsModel = this.settings.get('myNotificationsInstance'),
                searchModel = this.settings.get('searchInstance'),
                myInfoModel = this.settings.get('myInfoInstance');

            this.appChannel.on({
                'activePaymentMenuTab': function(data) {
                    if (data.menuId) {
                        this.components.paymentMenuComponent.activePaymentMenuTab(data);
                    }

                }.bind(this),
                'inactivePaymentMenuTab': function() {
                    this.components.paymentMenuComponent.inactivePaymentMenuTab();
                }.bind(this),
                'setProfileHeader': function(data) {
                    this.model.lens('paymentMenuComponent.showBlock').set(false);
                    this.model.lens('moduleHeaderComponent.headerLabel').set(data.headerLabel);
                }.bind(this)
            });

            //Create named instances that are available @controller.components.{componentName}
            this.register.components(this, [{
                name: 'paymentMenuComponent',
                model: observable.Model.combine(paymentMenuModel),
                spec: PaymentMenuSpec,
                methods: PaymentMenuMethods
            }, {
                name: 'myInfoComponent',
                model: observable.Model.combine(myInfoModel),
                spec: MyInfoSpec,
                methods: MyInfoMethods
            }, {
                name: 'moduleHeaderComponent',
                model: this.model.lens('moduleHeaderComponent'),
                spec: ModuleHeaderSpec,
                methods: ModuleHeaderMethods
            }, {
                name: 'topMenuComponent',
                model: observable.Model.combine(topMenuModel),
                spec: TopMenuSpec,
                methods: TopMenuMethods
            }, , {
                name: 'myNotificationsComponent',
                model: observable.Model.combine(notificationsModel),
                spec: MyNotificationsSpec,
                methods: MyNotificationsMethods
            }, {
                name: 'searchData',
                model: observable.Model.combine(searchModel),
                spec: SearchSpec,
                methods: SearchMethods
            }, {
                name: 'headerContainerComponent',
                model: observable.Model.combine({}),
                spec: HeaderContainerSpec,
                methods: HeaderContainerMethods
            }]);

            //Update Gretting message using setting util
            dynamicContentUtil.dynamicSettings.set(this.components.myNotificationsComponent, 'greeting', 'greeting_morning');

            // return ['header/header', this.model];
            return [
                [this.components.headerContainerComponent, 'header/headerContainer', {
                    target: '#header-container',
                    react: true,
                }], [this.components.paymentMenuComponent, 'payments/paymentsMenu/paymentsMenu', {
                    target: '#payment-menu',
                    react: true
                }], [this.components.topMenuComponent, 'header/topMenu', {
                    target: '#top-menu',
                    react: true
                }], [this.components.myInfoComponent, 'header/myInfo', {
                    target: '#my-info',
                    react: true
                }], [this.components.myNotificationsComponent, 'header/notifications', {
                    target: '#my-notifications',
                    react: true
                }], [this.components.searchData, 'header/search', {
                    target: '#my-search',
                    react: true
                }]
            ];
        };
    };
});