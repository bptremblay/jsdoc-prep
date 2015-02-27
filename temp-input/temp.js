/**@module Details*/
define(function(require) {

    return function DetailsController() {
        var controllerChannel = require('blue/event/channel/controller'),
            observable = require('blue/observable');

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
                    'spec': require('bluespec/mortgage_account_header'),
                    'component': require('dashboard/component/myAccounts/mortgageAccountHeader'),
                    'view': 'myAccounts/mortgageAccountHeader'
                },
                'INVESTMENT': {
                    'spec': require('dashboard/spec/myAccounts/investmentDetails'),
                    'component': require('dashboard/component/myAccounts/investmentDetails'),
                    'view': 'myAccounts/investmentDetails'
                },
                'DDA': {
                    'spec': require('bluespec/dda_account_header'),
                    'component': require('dashboard/component/myAccounts/ddaAccountHeader'),
                    'view': 'myAccounts/ddaAccountHeader'
                },
                'CDS': {
                    'spec': require('bluespec/cds_account_header'),
                    'component': require('dashboard/component/myAccounts/cdsAccountHeader'),
                    'view': 'myAccounts/cdsAccountHeader'
                },
                'PrePaid': {
                    'spec': require('bluespec/prepaid_account_header'),
                    'component': require('dashboard/component/myAccounts/prepaidAccountHeader'),
                    'view': 'myAccounts/prepaidAccountHeader'
                },
                'DEFAULT': {
                    'spec': require('bluespec/dda_account_header'),
                    'component': require('dashboard/component/myAccounts/ddaAccountHeader'),
                    'view': 'myAccounts/ddaAccountHeader'
                }
            };
            this.headerDropDownSpec = require('bluespec/mortgage_account_things_you_can_do');
            this.headerDropDownComponent = require('dashboard/component/myAccounts/headerDropDown');
            this.headerDropDownView = 'myAccounts/headerDropDown';

            controllerChannel.on({
                'getDetails': function(inputData) {
                    switch (inputData.accountType) {
                        case 'DDA':
                            this.getDetails(inputData);
                            break;
                        case 'MORTGAGE':
                            this.getMortgageDetails(inputData);
                            break;
                        default:
                            this.getDetails_Framework(inputData);
                    }
                }.bind(this)

            });

        };

        /**
         * Function for default action
         * @function index
         * @memberOf module:Index~this
         */
        this.index = function() {};

        this.getMortgageDetails = function(inputData) {
            var dataModel = observable.Model({}),
                instanceName = inputData.accountId + 'Details',
                headerDropDownInstanceName = inputData.accountId + 'headerDropDown',
                componentCollection = [],
                detailsData = {},
                accountType,
                svcType,
                headerDropDownModel;

            svcType = this.statusCodeMapper.getAccountsMessage('ACCOUNT_TYPE_MAPPER')[inputData.accountType];

            this.detailsServices.details[svcType.detailSvc]({
                'accountId': inputData.accountId
            }).then(function(data) {
                inputData.isNonInterestTypeAccount = this.dataTransform.isNonInterestTypeAccount(data.detail);
                detailsData = this.dataTransform.mortgageDetailData(data);
                accountType = inputData.accountType;

                this.register.components(this, [{
                    name: instanceName,
                    model: dataModel,
                    spec: this.accountsDetailsMapper[accountType].spec,
                    methods: this.accountsDetailsMapper[accountType].component
                }]);

                this.components[instanceName].requestAccountHeaderDetails(inputData, detailsData);

                componentCollection.push([this.components[instanceName], this.accountsDetailsMapper[accountType].view, {
                    append: false,
                    target: '#details'
                }]);

                //header drop down model
                headerDropDownModel = observable.Model({
                    'accountId': inputData.accountId,
                    'accountType': inputData.accountType
                });
                this.register.components(this, [{
                    name: headerDropDownInstanceName,
                    model: headerDropDownModel,
                    spec: this.headerDropDownSpec,
                    methods: this.headerDropDownComponent
                }]);

                componentCollection.push([this.components[headerDropDownInstanceName], this.headerDropDownView, {
                    append: false,
                    target: '#frameForDropDown'
                }]);

                this.executeCAV(componentCollection);
            }.bind(this));
        };

        this.getDetails_Framework = function(inputData) {
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
            if (inputData.accountType === 'MORTGAGE') {
                this.components[instanceName].requestAccountDetails(inputData);
            } else {
                this.components[instanceName].displayDetails(inputData);
            }

            this.executeCAV([this.components[instanceName], this.accountsDetailsMapper[inputData.accountType].view, {
                append: false,
                target: '#details'
            }]);
        };

        this.getDetails = function(inputData) {
            var dataModel = observable.Model({}),
                instanceName = inputData.accountId + 'Details',
                componentCollection = [],
                detailsData = {},
                accountType,
                svcType;

            svcType = this.statusCodeMapper.getAccountsMessage('ACCOUNT_TYPE_MAPPER')[inputData.accountType];

            this.detailsServices.details[svcType.detailSvc]({
                'accountId': inputData.accountId
            }).then(function(data) {
                inputData.isNonInterestTypeAccount = this.dataTransform.isNonInterestTypeAccount(data.detail);
                detailsData = this.dataTransform.accountDetails(data.detail, inputData.accountType);
                accountType = this.dataTransform.getParentAccountType(detailsData.detailType);
                this.register.components(this, [{
                    name: instanceName,
                    model: dataModel,
                    spec: this.accountsDetailsMapper[accountType].spec,
                    methods: this.accountsDetailsMapper[accountType].component
                }]);

                this.components[instanceName].requestAccountHeaderDetails(inputData, detailsData);
                componentCollection.push([this.components[instanceName], this.accountsDetailsMapper[accountType].view, {
                    append: false,
                    target: '#details'
                }]);
                if (detailsData.overdraftProtectionDetail != null && detailsData.overdraftProtectionDetail !== undefined) {
                    this.updateOverdraftSettings(detailsData.overdraftProtectionDetail);
                    componentCollection.push([this.components.accountOverdraftSettings, 'myAccounts/accountOverdraftProtection', {
                        append: false,
                        target: '#overdraftSettings'
                    }]);
                }
                this.executeCAV(componentCollection);

            }.bind(this));
        };

        this.updateOverdraftSettings = function(inputData) {
            var overdraftModel = observable.Model({});

            this.register.components(this, [{
                name: 'accountOverdraftSettings',
                model: overdraftModel,
                spec: require('bluespec/account_overdraft_protection'),
                methods: require('dashboard/component/myAccounts/accountOverdraftProtection')
            }]);

            this.components.accountOverdraftSettings.requestOverdraftLimit(inputData);
        };
    };
});
