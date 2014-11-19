define(function(require) {

    return function IndexController() {

        var observable = require('blue/observable'),
            //Send Money Component
            SendMoneySpec = require('dashboard/spec/payments/sendMoney/sendMoney'),
            SendMoneyMethods = require('dashboard/component/payments/sendMoney/sendMoney'),
            //Pay Bill Component
            payBillsSpec = require('dashboard/spec/payments/payBills/payBills'),
            payBillsMethods = require('dashboard/component/payments/payBills/payBills'),
            payBillsVerifySpec = require('dashboard/spec/payments/payBills/payBillsVerify'),
            payBillsVerifyMethods = require('dashboard/component/payments/payBills/payBillsVerify'),
            payBillsConfirmSpec = require('dashboard/spec/payments/payBills/payBillsConfirm'),
            payBillsConfirmMethods = require('dashboard/component/payments/payBills/payBillsConfirm'),
            //Transfer Money Component
            TransferMoneySpec = require('dashboard/spec/payments/transferMoney/transferMoney'),
            TransferMoneyMethods = require('dashboard/component/payments/transferMoney/transferMoney');
        this.init = function() {
            this.model = observable.Model.combine({
                'payBillsComponent': {},
                'sendMoneyComponent': {},
                'transferMoneyComponent': {},
                'payBillsVerifyComponent': {},
                'payBillsConfirmComponent': {
                    ASSETS_INDEX: envConfig.ASSETS_INDEX
                }
            });

        };

        /**
         * Function for default action
         * @function index
         * @memberOf module:Indexthis
         */
        this.index = function(params) {
            var component = params[0];

            //Create named instances that are available @controller.components.{componentName}
            this.register.components(this, [{
                name: 'payBills',
                model: this.model.lens('payBillsComponent'),
                spec: payBillsSpec,
                methods: payBillsMethods
            }, {
                name: 'sendMoney',
                model: this.model.lens('sendMoneyComponent'),
                spec: SendMoneySpec,
                methods: SendMoneyMethods
            }, {
                name: 'transferMoney',
                model: this.model.lens('transferMoneyComponent'),
                spec: TransferMoneySpec,
                methods: TransferMoneyMethods
            }]);
            //update footer depending on the account type
            this.appChannel.emit('updateFooter', {
                data: ''
            });
            this.appChannel.emit('activePaymentMenuTab', {
                menuId: component
            });
            this.executeCAV([this.components[component], 'payments/' + component + '/' + component, {
                'target': '#content',
                append: false,
                react: true
            }]);
        };

        this.payBillsVerify = function() {
            this.register.components(this, [{
                name: 'payBillsVerify',
                model: this.model.lens('payBillsVerifyComponent'),
                spec: payBillsVerifySpec,
                methods: payBillsVerifyMethods
            }]);
            this.executeCAV([this.components.payBillsVerify, 'payments/payBills/payBillsVerify', {
                append: false,
                'target': '#content',
                react: true
            }]);
        };

        this.payBillsConfirm = function() {
            this.register.components(this, [{
                name: 'payBillsConfirm',
                model: this.model.lens('payBillsConfirmComponent'),
                spec: payBillsConfirmSpec,
                methods: payBillsConfirmMethods
            }]);
            this.executeCAV([this.components.payBillsConfirm, 'payments/payBills/payBillsConfirm', {
                append: false,
                'target': '#content',
                react: true
            }]);
        }
    };
});