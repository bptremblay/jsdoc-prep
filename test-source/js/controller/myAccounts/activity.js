define(function(require) {

    return function ActivityController() {
        var controllerChannel = require('blue/event/channel/controller'),
            observable = require('blue/observable'),

            //Account Activity Component
            activitySpec = require('dashboard/spec/myAccounts/accountActivity'),
            activityMethod = require('dashboard/component/myAccounts/accountActivity');

        this.init = function() {
            this.accountsDetailsMapper = {
                'CARD': {
                    'spec': require('dashboard/spec/myAccounts/cardDetails'),
                    'component': require('dashboard/component/myAccounts/cardDetails'),
                    'view': 'myAccounts/cardDetails'
                },
                'AUTOLOAN': {
                    'spec': require('dashboard/spec/myAccounts/autoLoanDetails'),
                    'component': require('dashboard/component/myAccounts/autoLoanDetails'),
                    'view': 'myAccounts/autoLoanDetails'
                },
                'AUTOLEASE': {
                    'spec': require('dashboard/spec/myAccounts/autoLeaseDetails'),
                    'component': require('dashboard/component/myAccounts/autoLeaseDetails'),
                    'view': 'myAccounts/autoLeaseDetails'
                },
                'LOAN': {
                    'spec': require('dashboard/spec/myAccounts/loanDetails'),
                    'component': require('dashboard/component/myAccounts/loanDetails'),
                    'view': 'myAccounts/loanDetails'
                },
                'MORTGAGE': {
                    'spec': require('dashboard/spec/myAccounts/mortgageDetails'),
                    'component': require('dashboard/component/myAccounts/mortgageDetails'),
                    'view': 'myAccounts/mortgageDetails'
                },
                'INVESTMENT': {
                    'spec': require('dashboard/spec/myAccounts/investmentDetails'),
                    'component': require('dashboard/component/myAccounts/investmentDetails'),
                    'view': 'myAccounts/investmentDetails'
                },
                'DDA': {
                    'spec': require('dashboard/spec/myAccounts/ddaDetails'),
                    'component': require('dashboard/component/myAccounts/ddaDetails'),
                    'view': 'myAccounts/ddaDetails'
                },
                'DEFAULT': {
                    'spec': require('dashboard/spec/myAccounts/ddaDetails'),
                    'component': require('dashboard/component/myAccounts/ddaDetails'),
                    'view': 'myAccounts/ddaDetails'
                }
            };

            controllerChannel.on({
                'setAccountActivity': function(inputData) {
                    this.index(inputData);
                }.bind(this),
                'getDetails': function(inputData) {
                    this.getDetails(inputData);
                }.bind(this)
            });
        };

        /**
         * Function for default action
         * @function index
         * @memberOf module:activity~ActivityController
         */
        this.index = function(params) {
            var activityModel = observable.Model({
                pendingActivity: [],
                pendingActivitySortStyle: 'DES',
                postedActivity: [],
                postedActivitySortStyle: 'DES',
                accountName: null,
                accountMask: null,
                accountId: null,
                accountType: null,
                nextPageId: false
            });

            this.model = observable.Model.combine({
                'activityComponent': activityModel,
            });
            //Create named instances that are available @controller.components.{componentName}
            this.register.components(this, [{
                name: 'activityComponent',
                model: activityModel,
                spec: activitySpec,
                methods: activityMethod
            }]);

            this.executeCAV([this.components.activityComponent, 'myAccounts/activity', {
                target: '#activity-transactions',
                react: true,
                append: false
            }]);
            this.components.activityComponent.list(params);
        };

        this.getDetails = function(inputData) {
            var dataModel = observable.Model({
                    presentBalance: ''
                }),
                instanceName = inputData.accountId + 'Details';

            this.register.components(this, [{
                name: instanceName,
                model: dataModel,
                spec: this.accountsDetailsMapper[inputData.accountType].spec,
                methods: this.accountsDetailsMapper[inputData.accountType].component
            }]);

            this.executeCAV([this.components[instanceName], this.accountsDetailsMapper[inputData.accountType].view, {
                append: false,
                target: '#details',
                react: true
            }]);
            this.components[instanceName].displayDetails(inputData);
        };
    };
});
