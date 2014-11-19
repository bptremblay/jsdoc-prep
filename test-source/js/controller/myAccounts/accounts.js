define(function(require) {

    return function AccountsController() {

        require('dashboard/service/languageMapper').call(this);

        var observable = require('blue/observable'),
            controllerChannel = require('blue/event/channel/controller'),
            accountsContainerSpec = require('dashboard/spec/myAccounts/accountsContainer'),
            accountsContainerMethod = require('dashboard/component/myAccounts/accountsContainer');

        this.init = function() {
            //initiate component container
            this.model = observable.Model.combine({});
            this.accountsMapper = {
                'CARD': {
                    'spec': require('dashboard/spec/myAccounts/card'),
                    'component': require('dashboard/component/myAccounts/card'),
                    'view': 'myAccounts/card'
                },
                'AUTOLOAN': {
                    'spec': require('dashboard/spec/myAccounts/autoLoan'),
                    'component': require('dashboard/component/myAccounts/autoLoan'),
                    'view': 'myAccounts/autoLoan'
                },
                'AUTOLEASE': {
                    'spec': require('dashboard/spec/myAccounts/autoLease'),
                    'component': require('dashboard/component/myAccounts/autoLease'),
                    'view': 'myAccounts/autoLease'
                },
                'LOAN': {
                    'spec': require('dashboard/spec/myAccounts/loan'),
                    'component': require('dashboard/component/myAccounts/loan'),
                    'view': 'myAccounts/loan'
                },
                'MORTGAGE': {
                    'spec': require('dashboard/spec/myAccounts/mortgage'),
                    'component': require('dashboard/component/myAccounts/mortgage'),
                    'view': 'myAccounts/mortgage'
                },
                'INVESTMENT': {
                    'spec': require('dashboard/spec/myAccounts/investment'),
                    'component': require('dashboard/component/myAccounts/investment'),
                    'view': 'myAccounts/investment'
                },
                'DDA': {
                    'spec': require('dashboard/spec/myAccounts/dda'),
                    'component': require('dashboard/component/myAccounts/dda'),
                    'view': 'myAccounts/dda'
                },
                'DEFAULT': {
                    'spec': require('dashboard/spec/myAccounts/dda'),
                    'component': require('dashboard/component/myAccounts/dda'),
                    'view': 'myAccounts/dda'
                }
            };

        };

        /**
         * Function for default action
         * @function index
         * @memberOf module:Indexthis
         */
        this.index = function(params) {
            var summaryData = null,
                requestedAccountId = params[0],
                componentCollection = [],
                accountType,
                account, isAppend = true,
                accountsPromise = new(require('blue/deferred'))(),
                switchedApp = this.settings.get('switchedApp', this.settings.Type.USER) || false;

            if (switchedApp === true) {
                this.model.set({});
                this.settings.set('switchedApp', false, this.settings.Type.USER);
            }

            this.appChannel.emit('inactivePaymentMenuTab', {});

            this.firstValidAccountId = null;
            this.dataTransform.showOverlay();
            //the action request is assumed to be direct when the model is unavailable
            if (!this.model.get()[requestedAccountId]) {

                this.summaryServices.summary['accounts.dashboard.summary.svc']().then(function(data) {

                    //perform data processing on the accounts information received from services
                    summaryData = this.dataTransform.accountSummaryData(data.accounts);

                    //show logo based on brandId
                    this.appChannel.emit('updateMegaMenuLogo', {
                        brandId: data.brandId
                    });

                    //loop thru each account and construct new component and its associated model schema
                    for (var i in summaryData) {
                        //simplify account info access
                        account = summaryData[i];

                        var itemInstanceName = account.accountId,
                            processedSummaryData = this.dataTransform.prepareSummaryData(account),
                            dataModel = observable.Model(processedSummaryData);

                        if (this.dataTransform.checkAccountTypeSupport(account.summaryType)) {
                            account.lead_value = 'N/A';
                            account.summaryType = 'DEFAULT';
                        }
                        accountType = account.summaryType;
                        //update model
                        this.model.lens(itemInstanceName).set(processedSummaryData);

                        this.register.components(this, [{
                            name: itemInstanceName,
                            model: dataModel,
                            spec: this.accountsMapper[accountType].spec,
                            methods: this.accountsMapper[accountType].component
                        }]);

                        //set the first valid DDA or CARD account to be enabled and marked active
                        if (!this.firstValidAccountId && account.summary) {
                            this.firstValidAccountId = account.accountId;
                        }

                        componentCollection.push([this.components[itemInstanceName], this.accountsMapper[accountType].view, {
                            'append': isAppend,
                            'target': '#accounts',
                            'react': true
                        }]);
                        isAppend = true;

                        if (this.dataTransform.isProfileRefresh(account)) {
                            this.components[itemInstanceName].refreshBalance(account.accountId);
                        }
                    }
                    this.executeCAV(componentCollection);

                    //when an account is explicitly requestedly (in params) overwrite the default first account info
                    if (requestedAccountId) {
                        this.firstValidAccountId = requestedAccountId;
                    }
                    // //reset account status only if active id is found
                    if (this.firstValidAccountId) {
                        this.components[this.firstValidAccountId].showDetails(this.firstValidAccountId);
                    }
                    //update footer depending on the account type
                    this.appChannel.emit('updateFooter', {
                        data: this.dataTransform.getFootNote(data.accounts)
                    });

                }.bind(this));

                this.register.components(this, [{
                    name: 'accountsContainer',
                    model: observable.Model({}),
                    spec: accountsContainerSpec,
                    methods: accountsContainerMethod
                }]);
                this.executeCAV([this.components.accountsContainer, 'myAccounts/accountsContainer', {
                    target: '#content',
                    react: true
                }]);
            }
        };
    };
});