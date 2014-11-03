define(function(require) {
    return function AccountsController() {

        var observable = require('blue/observable'),
            controllerChannel = require('blue/event/channel/controller');

        this.init = function() {

            this.layoutContainerSpec = require('blue-spec/dist/spec/layout');
            this.layoutContainerComponent = require('dashboard/component/myAccounts/mortgageExpanded');
            this.layoutContainerView = 'myAccounts/index';

            //initiate component container
            this.model = observable.Model.combine({});
            this.accountsMapper = {
                'CARD': {
                    'spec': require('bluespec/credit_card_account'),
                    'component': require('dashboard/component/myAccounts/creditCardAccount'),
                    'view': 'myAccounts/creditCardAccount'
                },
                'HEL': {
                    'spec': require('bluespec/hel_account'),
                    'component': require('dashboard/component/myAccounts/helAccount'),
                    'view': 'myAccounts/helAccount'
                },
                'RCA': {
                    'spec': require('bluespec/rca_account'),
                    'component': require('dashboard/component/myAccounts/rcaAccount'),
                    'view': 'myAccounts/rcaAccount'
                },
                'HEO': {
                    'spec': require('bluespec/heo_account'),
                    'component': require('dashboard/component/myAccounts/heoAccount'),
                    'view': 'myAccounts/heoAccount'
                },
                'MORTGAGE': {
                    'spec': require('bluespec/mortgage_account'),
                    'component': require('dashboard/component/myAccounts/mortgageAccount'),
                    'view': 'myAccounts/mortgageAccount'
                },
                'DDA': {
                    'spec': require('bluespec/deposit_accounts'),
                    'component': require('dashboard/component/myAccounts/depositAccounts'),
                    'view': 'myAccounts/depositAccounts'
                },
                'DEFAULT': {
                    'spec': require('bluespec/deposit_accounts'),
                    'component': require('dashboard/component/myAccounts/depositAccounts'),
                    'view': 'myAccounts/depositAccounts'
                }
            };

            this.appChannel.on({
                'initAccounts': function(params) {
                    this.index(params);
                }.bind(this),

            });

        };

        /**
         * Function for default action
         * @function index
         * @memberOf module:Indexthis
         */
        this.index = function(params) {
            params = params.params;
            var summaryData = null,
                requestedAccountId = params[0],
                componentCollection = [],
                accountType,
                account, updatedInfo, isAppend = false,
                switchedApp = this.settings.get('switchedApp', this.settings.Type.USER) || false;

            var layoutContainerModel = observable.Model({});

            this.register.components(this, [{
                name: 'layoutContainer',
                model: layoutContainerModel,
                spec: this.layoutContainerSpec,
                methods: this.layoutContainerComponent
            }]);

            componentCollection.push([this.components.layoutContainer, this.layoutContainerView, {
                'target': '#content'
            }]);

            if (switchedApp === true) {
                this.model.set({});
                this.settings.set('switchedApp', false, this.settings.Type.USER);
            }

            this.firstValidAccountId = null;
            this.dataTransform.showOverlay();
            //the action request is assumed to be direct when the model is unavailable

            this.summaryServices.summary['accounts.dashboard.summary.svc']().then(function(data) {

                //perform data processing on the accounts information received from services
                summaryData = this.dataTransform.accountSummaryData(data.accounts);

                //loop thru each account and construct new component and its associated model schema
                for (var i in summaryData) {
                    //simplify account info access
                    account = summaryData[i];

                    // TODO: CONSIDERING ONLY THE SPECIFIC ACCOUNTS IN SCOPE. NEED TO REVISIT IN EVERY SPRINT.

                    if (account.summaryType === 'DDA' || account.summaryType === 'MORTGAGE' || account.summaryType === 'CARD' || account.summaryType === 'LOAN') {
                        var itemInstanceName = account.accountId,
                            processedSummaryData = this.dataTransform.prepareSummaryData(account),
                            dataModel = observable.Model(processedSummaryData);

                        if (this.dataTransform.checkAccountTypeSupport(account.summaryType)) {
                            account.lead_value = 'N/A';
                            account.summaryType = 'DEFAULT';
                        }

                        // for loan account type, the components are different for each detail type; for others, summary type.
                        accountType = account.summaryType === 'LOAN' ? account.detailType : account.summaryType;

                        this.register.components(this, [{
                            name: itemInstanceName,
                            model: dataModel,
                            spec: this.accountsMapper[accountType].spec,
                            methods: this.accountsMapper[accountType].component
                        }]);
                        componentCollection.push([this.components[itemInstanceName], this.accountsMapper[accountType].view, {
	                        'append': isAppend,
	                        'target': '#accounts',
	                        'react': true
                    	}]);

                        isAppend = true;

                        //set the first valid DDA or CARD account to be enabled and marked active
                        if (!this.firstValidAccountId) {
                            this.firstValidAccountId = account.accountId;
                        }

                        if (this.dataTransform.isProfileRefresh(account)) {
                        	this.requestAccountSummaryInfo(account);
                        }
                    }
                }
                this.executeCAV(componentCollection);

                //when an account is explicitly requestedly (in params) overwrite the default first account info
                if (requestedAccountId) {
                    this.firstValidAccountId = requestedAccountId;
                }
                if (this.firstValidAccountId) {
                    this.components[this.firstValidAccountId].requestAccountInformation(this.firstValidAccountId);
                }
                //update footer depending on the account type
                controllerChannel.emit('updateFooter', {
                    data: this.dataTransform.getFootNote(data.accounts)
                });
            }.bind(this));
        };

        /**
         * Function to make dashboard summary service call
         * @function requestAccountSummaryInfo
         * @memberOf module:Index
         */
        this.requestAccountSummaryInfo = function(account) {
            var latestData;
            this.summaryServices.summary['accounts.dashboard.summary.refresh.svc']({
                'accountId': account.accountId
            }).then(function(latestAccountData) {
            	//adding the summaryType and detailType, as these are not present in the root
            	if (account){
            		latestAccountData.summaryType = account.summaryType;
            		latestAccountData.detailType = account.detailType;
            	}
                latestData = this.dataTransform.replaceLatestData(latestAccountData);

                if (account) {
                    this.components[account.accountId].requestAccountSummary(latestData);
                }

            }.bind(this));
        };
    };
});
