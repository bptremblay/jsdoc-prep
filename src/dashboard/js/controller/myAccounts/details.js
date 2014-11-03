define(function(require) {

    return function DetailsController() {
        var dynamicContentUtil = require('common/utility/dynamicContentUtil'),
            observable = require('blue/observable');

        this.init = function() {
            this.accountsDetailsMapper = {
                'LOAN': {
                    'spec': require('bluespec/hel_account_header'),
                    'component': require('dashboard/component/myAccounts/helAccountHeader'),
                    'view': 'myAccounts/helAccountHeader'
                },
                'HEL': {
                    'spec': require('bluespec/hel_account_header'),
                    'component': require('dashboard/component/myAccounts/helAccountHeader'),
                    'view': 'myAccounts/helAccountHeader',
                    'headerDropDownSpec': require('bluespec/hel_account_things_you_can_do'),
                    'headerDropDownComponent': require('dashboard/component/myAccounts/helAccountHeaderDropDown'),
                    'headerDropDownView': 'myAccounts/helAccountHeaderDropDown'

                },
                'HEO': {
                    'spec': require('bluespec/heo_account_header'),
                    'component': require('dashboard/component/myAccounts/heoAccountHeader'),
                    'view': 'myAccounts/heoAccountHeader',
                    'headerDropDownSpec': require('bluespec/heo_account_things_you_can_do'),
                    'headerDropDownComponent': require('dashboard/component/myAccounts/heoAccountThingsYouCanDo'),
                    'headerDropDownView': 'myAccounts/heoAccountThingsYouCanDo'
                },
                'RCA': {
                    'spec': require('bluespec/rca_header'),
                    'component': require('dashboard/component/myAccounts/rcaHeader'),
                    'view': 'myAccounts/rcaHeader',
                    'headerDropDownSpec': require('bluespec/rca_account_things_you_can_do'),
                    'headerDropDownComponent': require('dashboard/component/myAccounts/rcaHeaderDropDown'),
                    'headerDropDownView': 'myAccounts/rcaHeaderDropDown'
                },
                'MORTGAGE': {
                    'spec': require('bluespec/mortgage_account_header'),
                    'component': require('dashboard/component/myAccounts/mortgageAccountHeader'),
                    'view': 'myAccounts/mortgageAccountHeader'
                },
                'DDA': {
                    'spec': require('dashboard/spec/myAccounts/dda_account_header'),
                    'component': require('dashboard/component/myAccounts/ddaAccountHeader'),
                    'view': 'myAccounts/ddaAccountHeader',
                    //'headerDropDownSpec': require('bluespec/dda_account_things_you_can_do'), TODO: need to talk to blue-spec team to provide a setting for debit card coverage.
                    'headerDropDownSpec': require('dashboard/spec/myAccounts/dda_account_things_you_can_do'),
                    'headerDropDownComponent': require('dashboard/component/myAccounts/ddaThingsYouCanDoDropdown'),
                    'headerDropDownView': 'myAccounts/ddaThingsYouCanDoDropdown'
                },
                'CDA': {
                    'spec': require('bluespec/cds_account_header'),
                    'component': require('dashboard/component/myAccounts/cdsAccountHeader'),
                    'view': 'myAccounts/cdsAccountHeader'
                },
                'PrePaid': {
                    'spec': require('bluespec/prepaid_account_header'),
                    'component': require('dashboard/component/myAccounts/prepaidAccountHeader'),
                    'view': 'myAccounts/prepaidAccountHeader',
                    'headerDropDownSpec': require('bluespec/prepaid_account_things_you_can_do'),
                    'headerDropDownComponent': require('dashboard/component/myAccounts/prepaidAccountThingsYouCanDo'),
                    'headerDropDownView': 'myAccounts/prepaidAccountThingsYouCanDo'
                },
                'CARD': {
                    'spec': require('bluespec/credit_card_account_header'),
                    'component': require('dashboard/component/myAccounts/creditCardAccountHeader'),
                    'view': 'myAccounts/creditCardAccountHeader',
                    'headerDropDownSpec': require('bluespec/credit_card_account_things_you_can_do'),
                    'headerDropDownComponent': require('dashboard/component/myAccounts/creditCardAccountThingsYouCanDo'),
                    'headerDropDownView': 'myAccounts/creditCardAccountThingsYouCanDo'
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



            this.appChannel.on({
                'getDetails': function(inputData) {
                    switch (inputData.accountType) {
                        case 'DDA':
                        case 'CARD':
                            this.getDetails(inputData);
                            break;
                        case 'MORTGAGE':
                            this.getMortgageDetails(inputData);
                            break;
                        case 'LOAN':
                            this.getLoanDetails(inputData);
                            break;
                    }
                }.bind(this),
                'closedAccountMsg': function(data) {
                    this.getClosedAccountMsg(data);
                }.bind(this)
            });
        };

        /**
         * Function for default action
         * @function index
         * @memberOf module:Indexthis
         */
        this.index = function() {
            this.appChannel.on({
                'getExpanded': function() {}.bind(this)
            });
        };

        /**
         * Function to get the details for all loan types
         * HEL, RCA, HEO and ILA
         */
        this.getLoanDetails = function(inputData) {
            var dataModel = observable.Model({}),
                svcType,
                detailType,
                instanceName = inputData.accountId + 'Details',
                componentCollection = [],
                detailsData = {},
                headerDropDownModel,
                headerDropDownInstanceName = inputData.accountId + 'headerDropDown',
                accountType = inputData.accountType;

            svcType = this.serviceNameMapper.getServiceNames('ACCOUNT_TYPE_MAPPER')[inputData.accountType];

            this.detailsServices.details[svcType.detailSvc]({
                'accountId': inputData.accountId,
            }).then(function(data) {
                inputData.isNonInterestTypeAccount = this.dataTransform.isNonInterestTypeAccount(data.detail, inputData.accountType);
                detailsData = this.dataTransform.accountLoanDetails(data);
                detailType = data.detail.detailType;
                //get the summary type of the account based on the detail type
                accountType = this.dataTransform.getParentAccountType(detailType);

                this.register.components(this, [{
                    name: instanceName,
                    model: dataModel,
                    spec: this.accountsDetailsMapper[detailType].spec,
                    methods: this.accountsDetailsMapper[detailType].component
                }]);

                this.components[instanceName].requestAccountHeaderDetails(inputData, detailsData);
                componentCollection.push([this.components[instanceName], this.accountsDetailsMapper[detailType].view, {
                    react: true,
                    append: false,
                    target: '#details'
                }]);

                //pop up service call


                if (detailType === 'HEL') {
                    this.components[instanceName].output.emit('state', {
                        target: this,
                        value: 'HELpopup'
                    });
                }
                if (detailType === 'RCA') {
				    this.components[instanceName].output.emit('state', {
				        target: this,
				        value: 'RCApopup'
				    });
				}

                //header drop down model
                headerDropDownModel = observable.Model({
                    'accountId': inputData.accountId,
                    'accountType': accountType
                });
                this.register.components(this, [{
                    name: headerDropDownInstanceName,
                    model: headerDropDownModel,
                    spec: this.accountsDetailsMapper[detailType].headerDropDownSpec,
                    methods: this.accountsDetailsMapper[detailType].headerDropDownComponent
                }]);

                componentCollection.push([this.components[headerDropDownInstanceName], this.accountsDetailsMapper[detailType].headerDropDownView, {
                    react: true,
                    append: false,
                    target: '#frameForDropDown'
                }]);
                this.executeCAV(componentCollection);
            }.bind(this));
        };

        this.getMortgageDetails = function(inputData) {
            var dataModel = observable.Model({}),
                instanceName = inputData.accountId + 'Details',
                headerDropDownInstanceName = inputData.accountId + 'headerDropDown',
                componentCollection = [],
                detailsData = {},
                accountType,
                svcType,
                headerDropDownModel;

            svcType = this.serviceNameMapper.getServiceNames('ACCOUNT_TYPE_MAPPER')[inputData.accountType];

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
                    react: true,
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
                    react: true,
                    target: '#frameForDropDown'
                }]);
                this.executeCAV(componentCollection);
            }.bind(this));
        };

        this.getClosedAccountMsg = function(data) {
            var dataModel = observable.Model({});

            this.register.components(this, [{
                name: 'creditCardComponent',
                model: dataModel,
                spec: this.accountsDetailsMapper[data.accountType].spec,
                methods: this.accountsDetailsMapper[data.accountType].component
            }]);

            this.executeCAV([this.components.creditCardComponent, 'myAccounts/closedAccount', {
                append: false,
                target: '#details',
                react: true
            }]);
        };

        this.getDetails = function(inputData) {
            var dataModel = observable.Model({
                    'accountId': inputData.accountId,
                    'accountType': inputData.accountType
                }),
                svcType,
                detailType,
                instanceName = inputData.accountId + 'Details',
                componentCollection = [],
                detailsData = {},
                headerDropDownModel,
                thingsYouCanDoInstanceName = inputData.accountId + 'headerDropDown',
                accountType = inputData.accountType;

            svcType = this.serviceNameMapper.getServiceNames('ACCOUNT_TYPE_MAPPER')[inputData.accountType];

            this.detailsServices.details[svcType.detailSvc]({
                'accountId': inputData.accountId
            }).then(function(data) {
                inputData.isNonInterestTypeAccount = this.dataTransform.isNonInterestTypeAccount(data.detail);

                detailsData = this.dataTransform.accountDetails(data, inputData.accountType);
                accountType = (detailsData.detailType !== null) ? this.dataTransform.getParentAccountType(detailsData.detailType) : inputData.accountType;

                this.register.components(this, [{
                    name: instanceName,
                    model: dataModel,
                    spec: this.accountsDetailsMapper[accountType].spec,
                    methods: this.accountsDetailsMapper[accountType].component
                }]);

                if (inputData.accountType === 'CARD') {
                    inputData.paymentDueDateLabel = dynamicContentUtil.dynamicContent.get(this.components[instanceName], 'payment_due_date_label', {
                        dueDate: detailsData.nextPaymentDueDate
                    });
                }
                this.components[instanceName].requestAccountHeaderDetails(inputData, detailsData);

                componentCollection.push([this.components[instanceName], this.accountsDetailsMapper[accountType].view, {
                    append: false,
                    target: '#details',
                    react: true
                }]);

                //things you can do dropdown component
                this.register.components(this, [{
                    name: thingsYouCanDoInstanceName,
                    model: dataModel,
                    spec: this.accountsDetailsMapper[accountType].headerDropDownSpec,
                    methods: this.accountsDetailsMapper[accountType].headerDropDownComponent
                }]);

                componentCollection.push([this.components[thingsYouCanDoInstanceName], this.accountsDetailsMapper[accountType].headerDropDownView, {
                    append: false,
                    react: true,
                    target: '#thingsYouDo'
                }]);

                //Debit card coverage
                this.components[instanceName].debitCardCoverageEnrollmentStatus = detailsData.debitCardCoverageEnrollmentStatus;
                var debitCardCoverageSetting = (detailsData.debitCardCoverageEnrollmentStatus != undefined && detailsData.debitCardCoverageEnrollmentStatus) ? true : false;
                this.components[thingsYouCanDoInstanceName].debitCardCoverageSettingsAvailable = debitCardCoverageSetting;

                if (detailsData.overdraftProtectionDetail != null && detailsData.overdraftProtectionDetail !== undefined) {
                    this.updateOverdraftSettings(detailsData.overdraftProtectionDetail);
                    componentCollection.push([this.components.accountOverdraftSettings, 'myAccounts/accountOverdraftProtection', {
                        append: false,
                        target: '#overdraftSettings',
                        react: true
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
