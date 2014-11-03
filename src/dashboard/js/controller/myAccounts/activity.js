define(function(require) {

    return function ActivityController() {
        var observable = require('blue/observable'),
            when = require('when/when');

        this.init = function() {

            this.accountActivityMapper = {
                'DDA': {
                    'spec': require('bluespec/dda_account_activity_all_transactions'),
                    'component': require('dashboard/component/myAccounts/ddaAccountActivityAllTransactions'),
                    'view': 'myAccounts/ddaAccountActivityAllTransactions'
                },
                'ACTIVITYHEADER': {
                    'spec': require('bluespec/dda_account_activity_all_transactions_header'),
                    'component': require('dashboard/component/myAccounts/ddaAccountActivityAllTransactionsHeader'),
                    'view': 'myAccounts/ddaAccountActivityAllTransactionsHeader'
                },
                'FILTERACCOUNTACTIVITY': {
                    'spec': require('bluespec/filter_account_activity'),
                    'component': require('dashboard/component/myAccounts/filterAccountActivity'),
                    'view': 'myAccounts/filterAccountActivity'
                },
                'CARDPENDINGTRANSACTIONS': {
                    'spec': require('bluespec/credit_account_activity_pending_transaction'),
                    'component': require('dashboard/component/myAccounts/creditAccountActivityPendingTransaction'),
                    'view': 'myAccounts/creditAccountActivityPendingTransactions'
                },
                'ONHOLD': {
                    'spec': require('bluespec/dda_account_activity_hold_transactions'),
                    'component': require('dashboard/component/myAccounts/ddaAccountActivityHoldTransactions'),
                    'view': 'myAccounts/ddaAccountActivityHoldTransactions'
                },
                'CREDITACTIVITYHEADER': {
                    'spec': require('bluespec/credit_account_activity_all_transactions_header'),
                    'component': require('dashboard/component/myAccounts/creditAccountActivityAllTransactionsHeader'),
                    'view': 'myAccounts/creditAccountActivityAllTransactionsHeader'
                },
                'CREDITACTIVITYTRANSACTIONS': {
                    'spec': require('bluespec/credit_account_activity_all_transactions'),
                    'component': require('dashboard/component/myAccounts/creditAccountActivityAllTransactions'),
                    'view': 'myAccounts/creditAccountActivityAllTransactions'
                },
                'CREDITACCOUNTACTIVITYFILTER': {
                    'spec': require('bluespec/credit_account_activity_filter'),
                    'component': require('dashboard/component/myAccounts/creditAccountActivityFilter'),
                    'view': 'myAccounts/creditAccountActivityFilter'
                },
                'MORTGAGE': {
                    'spec': require('bluespec/mortgage_account_activity'),
                    'component': require('dashboard/component/myAccounts/mortgageAccountActivity'),
                    'view': 'myAccounts/mortgageAccountActivity'
                },
                'LOAN': {
                    'HEL': {
                        'spec': require('bluespec/hel_account_activity'),
                        'component': require('dashboard/component/myAccounts/helAccountActivity'),
                        'view': 'myAccounts/helAccountActivity'
                    },
                    'RCA': {
                        'spec': require('bluespec/rca_account_activity'),
                        'component': require('dashboard/component/myAccounts/rcaAccountActivity'),
                        'view': 'myAccounts/rcaAccountActivity'
                    },
                    'HEO': {
                    	'spec': require('bluespec/heo_account_activity'),
                    	'component': require('dashboard/component/myAccounts/heoAccountActivity'),
                    	'view': 'myAccounts/heoAccountActivity'
                    }
                },
                'DEFAULT': {
                    'spec': require('bluespec/dda_account_activity_all_transactions'),
                    'component': require('dashboard/component/myAccounts/ddaAccountActivityAllTransactions'),
                    'view': 'myAccounts/ddaAccountActivityAllTransactions'
                }
            };

            this.appChannel.on({
                'setAccountActivity': function(data) {
                    this.setAccountActivity(data);
                }.bind(this),
                'initActivity': function(params) {
                    this.index(params);
                }.bind(this)
            });
        };

        this.setAccountActivity = function(inputData) {
            switch (inputData.accountType) {
                case 'MORTGAGE':
                case 'LOAN':
                    this.setAccountActivity_Mortgage(inputData);
                    break;
                case 'DDA':
                    this.setDDAAccountActivity(inputData);
                    break;
                case 'CARD':
                    this.setCardAccountActivity(inputData);
                    break;
                default:
                    this.setDDAAccountActivity(inputData);
                    break;
            }
        };

        this.setDDAAccountActivity = function(inputData) {

            var svcType, activityListData = {},
                componentCollection = [],
                accountsListData, filterCriteria,
                accountId = inputData.accountId,
                detailType = inputData.detailType,
                accountType = inputData.accountType;

            activityListData = {
                name: inputData.accountName,
                mask: inputData.accountMask
            };

            var activityDataModel = observable.Model({
                'accountId': accountId,
                'accountType': accountType,
                'detailType': detailType,
                'showCheckFilter': detailType === 'PPX' || detailType === 'PPA' ? false : true
            });

            var requestParams = this.dataTransform.ddaFilterAccountActivity(inputData);

            svcType = this.serviceNameMapper.getServiceNames('ACCOUNT_TYPE_MAPPER')[accountType];

            //get Hold transactions
            this.activityServices.activity[svcType.onHoldSvc]({
            	'accountId': accountId}).then(function(data) {
	            var activityOnHoldDataModel = observable.Model({
	            	'accountId': accountId,
				    'accountType': accountType,
				    'detailType': detailType
	            });

                var onHoldListData = this.dataTransform.onHoldActivityList(data);

				this.register.components(this, [{
	                name: 'accountActivityHoldTransaction',
	                model: activityOnHoldDataModel,
	                spec: this.accountActivityMapper['ONHOLD'].spec,
	                methods: this.accountActivityMapper['ONHOLD'].component
	       		}]);

                this.components.accountActivityHoldTransaction.requestAccountActivity({
                    data: onHoldListData.onHoldData,
                    model: 'activityData'
                });

                this.executeCAV([this.components.accountActivityHoldTransaction, this.accountActivityMapper['ONHOLD'].view, {
                    'append': false,
                    'target': '#onhold-transactions',
                    'react': true
                }]);
            }.bind(this),
            function(jqXHR) {
                if (jqXHR.statusText === 'timeout' || jqXHR.status === 500) {
                    activityListData.noInfo = true;
                }
            }.bind(this));

            // Create named instance for all transactions (pending and posted)
            this.register.components(this, [{
                name: 'accountActivityHeaderComponent',
                model: activityDataModel,
                spec: this.accountActivityMapper['ACTIVITYHEADER'].spec,
                methods: this.accountActivityMapper['ACTIVITYHEADER'].component
            }]);

            componentCollection.push([this.components.accountActivityHeaderComponent, this.accountActivityMapper['ACTIVITYHEADER'].view, {
                'append': false,
                'target': '#activity-transactions',
                'react': true
            }]);

            // Create named instance for all transactions (pending and posted)
            this.register.components(this, [{
                name: 'allTransactionsComponent',
                model: activityDataModel,
                spec: this.accountActivityMapper[accountType].spec,
                methods: this.accountActivityMapper[accountType].component
            }]);

            this.activityServices.activity[svcType.activitySvc](requestParams).then(function(data) {
                accountsListData = this.dataTransform.depositAccountActivityList(data.result, inputData, accountType);

				this.components.allTransactionsComponent.model.lens('showBalance').set(true);
				this.components.accountActivityHeaderComponent.filterCriteria = '';
                if (inputData.isFilterBy){
                	var showBalances = this.dataTransform.showBalanceColumn(inputData);
					this.components.allTransactionsComponent.model.lens('showBalance').set(showBalances);
                	this.components.accountActivityHeaderComponent.transactionsFilterCount = accountsListData.activityData.list !== null ? accountsListData.activityData.list.length : 0;
                	this.components.accountActivityHeaderComponent.filterCriteria = this.dataTransform.ddaFilterCriteriaDescription(requestParams, inputData.isFilterBy);
                	this.components.accountActivityHeaderComponent.model.lens('requestParams').set(requestParams);
                }
                if (this.components.accountActivityHeaderComponent.transactionsFilterCount == 0) {
                	this.components.allTransactionsComponent.model.lens('filterInputData').set(inputData);
                }
                this.components.allTransactionsComponent.requestAccountActivity({
                    data: accountsListData.activityData
                });
                componentCollection.push([this.components.allTransactionsComponent, this.accountActivityMapper[inputData.accountType].view, {
                    'append': true,
                    'target': '#accountActivity',
                    'react': true
                }]);

                this.executeCAV(componentCollection);

                $('.account-summary-tab').removeClass('active');
                $('.acc' + accountId).addClass('active');

            }.bind(this),
            function(jqXHR) {
                if (jqXHR.statusText === 'timeout' || jqXHR.status === 500) {
                    activityListData.noInfo = true;
                }
            }.bind(this));
        };

        this.makeActivityCall = function(inputData) {
        	var accountType, currentList, instanceName, svcType, startRow, rows,
        		requestParamaters = {},
           		activityTableClassName = 'jpui table',
                activityTableToggleDisplayName = 'See Details';

           	instanceName = inputData.accountId + 'Activity';

            // Click 'see more transactions', inputData will contain a context object
            if (inputData.context) {
                currentList = this.components[instanceName].transactions;
                activityTableClassName = this.components[instanceName].model.lens('activityTableClassName').get();
                activityTableToggleDisplayName = this.components[instanceName].model.lens('toggleAccountActivityDisplay').get();
            }

			this.components[instanceName].model.lens('accountId').set(inputData.accountId);
            this.components[instanceName].model.lens('activityTableClassName').set(activityTableClassName);
            this.components[instanceName].model.lens('toggleAccountActivityDisplay').set(activityTableToggleDisplayName);

            accountType = inputData.accountType || this.components[instanceName].model.lens('accountType').get();
            this.components[instanceName].model.lens('accountType').set(accountType);
            this.components[instanceName].model.lens('hasEscrow').set(accountType === 'MORTGAGE');

            rows = inputData.rows || 25;
            startRow = this.components[instanceName].model.lens('nextRowId').get();

			requestParamaters.accountId = inputData.accountId;
            if (accountType === 'LOAN') {
                requestParamaters.pageId = startRow;
	            if (inputData.detailType) {
	                this.components[instanceName].model.lens('detailType').set(inputData.detailType);
	            }
            } else {
                requestParamaters.start = startRow;
                requestParamaters.rows = rows;
            }

            svcType = this.serviceNameMapper.getServiceNames('ACCOUNT_TYPE_MAPPER')[accountType];
            this.activityServices.activity[svcType.activitySvc](eval('(' + JSON.stringify(requestParamaters) + ')')).then(function(data) {
            	// if accountType is mortgage then value returned is nextRowId otherwise it's nextPageId
                this.components[instanceName].model.lens('nextRowId').set(accountType === "MORTGAGE" ? data.nextRowId : data.nextPageId);
                // To do: Before release delete this line. It's not necessary. However, it keeps stuff working for mock data.
                this.components[instanceName].model.lens('accountId').set(data && data.accountId);
                this.components[instanceName].transactions = this.dataTransform[accountType.toLowerCase() + 'AccountActivity'](data.result);

                if (currentList !== undefined && currentList != null && currentList.length > 0) {
                    // Appends new transactions list to previous transactions list
                    this.components[instanceName].transactions = currentList.concat(this.components[instanceName].transactions);
                }

                this.executeCAV_SharedMortgageAndLoanActivity(this.components[instanceName].model.get());
            }.bind(this),
            function(data) {
                this.components[instanceName].model.lens('error').set(this.statusCodeMapper.getAccountsMessage(data.status, 'en-us'));
                this.executeCAV_SharedMortgageAndLoanActivity(this.components[instanceName].model.get());
            }.bind(this));
        };

        this.setCardAccountActivity = function(inputData) {
            var svcType, activityData = {
                    name: inputData.accountName,
                    mask: inputData.accountMask
                },
                cardActivityList, componentCollection = [],
                accountId = inputData.accountId,
                accountType = inputData.accountType,
                detailType = inputData.detailType;

            var activityDataModel = observable.Model({
                'accountId': accountId,
                'accountType': accountType,
                'detailType': detailType
            });

            var pendingActivityDataModel = observable.Model({
                'accountId': accountId,
                'accountType': accountType,
                'detailType': detailType
            });

            this.register.components(this, [{
                name: 'cardPendingTransactionComponent',
                model: pendingActivityDataModel,
                spec: this.accountActivityMapper['CARDPENDINGTRANSACTIONS'].spec,
                methods: this.accountActivityMapper['CARDPENDINGTRANSACTIONS'].component
            }]);

            this.register.components(this, [{
                name: 'cardActivityHeaderComponent',
                model: activityDataModel,
                spec: this.accountActivityMapper['CREDITACTIVITYHEADER'].spec,
                methods: this.accountActivityMapper['CREDITACTIVITYHEADER'].component
            }]);

            this.register.components(this, [{
                name: 'cardActivityTransactionComponent',
                model: activityDataModel,
                spec: this.accountActivityMapper['CREDITACTIVITYTRANSACTIONS'].spec,
                methods: this.accountActivityMapper['CREDITACTIVITYTRANSACTIONS'].component
            }]);

            var requestParams = this.dataTransform.cardFilterAccountActivity(inputData);

            svcType = this.serviceNameMapper.getServiceNames('ACCOUNT_TYPE_MAPPER')[accountType];
            this.activityServices.activity[svcType.activitySvc](requestParams).then(function(data) {
                    var processedActivityData = {
                        pending: null,
                        posted: null
                    };
                    cardActivityList = this.dataTransform.cardActivityGroupList(data, inputData, accountType);
                    processedActivityData.pending = cardActivityList.pendingData.list;
                    processedActivityData.posted = cardActivityList.postedData.list;

                    this.components.cardActivityHeaderComponent.model.lens('statementOptions').set(this.dataTransform.createStatementOptions(data.statementPeriodOptions));
                    this.components.cardActivityHeaderComponent.model.lens('timePeriodOptions').set(this.dataTransform.createTimePeriodOptions(data.statementPeriodOptions));
                    this.components.cardActivityHeaderComponent.model.lens('tranTypeOptions').set(this.dataTransform.createTranTypeOptions(data.transactionTypeOptions));
                    this.components.cardActivityHeaderComponent.filterCriteria = '';
                    if (inputData.isFilterBy) {
                        this.components.cardActivityHeaderComponent.transactionsFilterCount = cardActivityList.postedData.list !== null ? cardActivityList.postedData.list.length : 0;
                        this.components.cardActivityHeaderComponent.filterCriteria = this.dataTransform.cardFilterCriteriaDescription(requestParams, inputData.isFilterBy);
                        this.components.cardActivityHeaderComponent.model.lens('requestParams').set(requestParams);
                    }
                    var append = false;

                    if (processedActivityData.pending) {
                        this.components.cardPendingTransactionComponent.requestAccountActivity({
                            data: cardActivityList.pendingData
                        });
                        componentCollection.push([this.components.cardPendingTransactionComponent, this.accountActivityMapper['CARDPENDINGTRANSACTIONS'].view, {
                            'append': append,
                            'target': '#activity-transactions',
                            'react': true
                        }]);

                        this.components.cardPendingTransactionComponent.totalPendingTransactions = cardActivityList.pendingData.list !== null ? cardActivityList.pendingData.list.length : 0;
                        append = true;
                    }

                    componentCollection.push([this.components.cardActivityHeaderComponent, this.accountActivityMapper['CREDITACTIVITYHEADER'].view, {
                        'append': append,
                        'target': '#activity-transactions',
                        'react': true
                    }]);

                    append = true;

                    this.components.cardActivityTransactionComponent.requestAccountActivity({
                        data: cardActivityList.postedData,
                        model: 'activityData'
                    });

                    componentCollection.push([this.components.cardActivityTransactionComponent, this.accountActivityMapper['CREDITACTIVITYTRANSACTIONS'].view, {
                        'append': append,
                        'target': '#activity-transactions',
                        'react': true
                    }]);

                    this.executeCAV(componentCollection);

                }.bind(this),
                function(jqXHR) {
                    if (jqXHR.statusText === 'timeout' || jqXHR.status === 500) {
                        cardActivityList.noInfo = true;
                    }
                }.bind(this));
        };

        this.setAccountActivity_Mortgage = function(inputData) {
            var instanceName = inputData.accountId + 'Activity';

            this.register.components(this, [{
                name: instanceName,
                model: observable.Model({}),
                spec: (inputData.accountType === 'LOAN' ? this.accountActivityMapper[inputData.accountType][inputData.detailType].spec : this.accountActivityMapper[inputData.accountType].spec),
                methods: (inputData.accountType === 'LOAN' ? this.accountActivityMapper[inputData.accountType][inputData.detailType].component : this.accountActivityMapper[inputData.accountType].component)
            }]);

            this.components[instanceName].requestAccountActivity(inputData);
        };

        this.filterByActivity = function(Data) {
            var dataModel = observable.Model({
                'accountId': Data.accountId,
                'accountType': Data.accountType,
                'detailType': Data.detailType,
                'showCheckFilter': Data.showCheckFilter,
                'dropdownOptions': this.dataTransform.createDropdownOptions(Data.detailType)
            });
            this.register.components(this, [{
                name: 'filterAccountActivityComponent',
                model: dataModel,
                spec: this.accountActivityMapper['FILTERACCOUNTACTIVITY'].spec,
                methods: this.accountActivityMapper['FILTERACCOUNTACTIVITY'].component
            }]);
            this.components.filterAccountActivityComponent.showCheckFilter = Data.showCheckFilter;

            if(Data.previousFilter){
            	this.components.filterAccountActivityComponent.transactionType = this.dataTransform.isDefined(Data.previousFilter.transactionType) ? Data.previousFilter.transactionType : 'ALL';
            	this.components.filterAccountActivityComponent.transactionPostedFromDate = this.dataTransform.isDefined(Data.previousFilter.dateLo) ? this.dataTransform.convertDate(Data.previousFilter.dateLo) : '';
            	this.components.filterAccountActivityComponent.transactionPostedToDate = this.dataTransform.isDefined(Data.previousFilter.dateHi) ? this.dataTransform.convertDate(Data.previousFilter.dateHi) : '';
            	this.components.filterAccountActivityComponent.transactionPostedTimeframe = this.dataTransform.isDefined(Data.previousFilter.dateOption) ? Data.previousFilter.dateOption : '';
            	this.components.filterAccountActivityComponent.transactionFromAmount = this.dataTransform.isDefined(Data.previousFilter.amountLo) ? Data.previousFilter.amountLo : '';
            	this.components.filterAccountActivityComponent.transactionToAmount = this.dataTransform.isDefined(Data.previousFilter.amountHi) ? Data.previousFilter.amountHi : '';
            	this.components.filterAccountActivityComponent.checkNumberFrom = this.dataTransform.isDefined(Data.previousFilter.checkLo) ? Data.previousFilter.checkLo : '';
            	this.components.filterAccountActivityComponent.checkNumberTo = this.dataTransform.isDefined(Data.previousFilter.checkHi) ? Data.previousFilter.checkHi : '';
            }

            this.executeCAV([this.components['filterAccountActivityComponent'], this.accountActivityMapper['FILTERACCOUNTACTIVITY'].view, {
                append: false,
                target: '#accountActivityFilter',
                react: true
            }]);
        };

		this.creditFilterByActivity = function(Data) {
            var dataModel = observable.Model({
                'accountId': Data.accountId,
                'accountType': Data.accountType,
                'detailType': Data.detailType,
                'timePeriodOptions': Data.timePeriodOptions,
                'tranTypeOptions': Data.tranTypeOptions
            });

            this.register.components(this, [{
                name: 'creditFilterActivityComponent',
                model: dataModel,
                spec: this.accountActivityMapper['CREDITACCOUNTACTIVITYFILTER'].spec,
                methods: this.accountActivityMapper['CREDITACCOUNTACTIVITYFILTER'].component
            }]);

            // Contextual Help Component
			this.commonComponentsUtil.insertContextualHelpComponent(this, {
				name: 'contextualHelpComponent-cardfilter-date',
				id: 'contextual-help-cardfilter-date',
				target: '#contextual-help-container-cardfilter-date',
				message: this.components.creditFilterActivityComponent.model.lens('transaction_date_range_advisory').get()
			});

            this.components.creditFilterActivityComponent.transactionPostedTimeframe = Data.timePeriodOptions ? Data.timePeriodOptions[0].value : undefined;
            this.components.creditFilterActivityComponent.transactionType = Data.tranTypeOptions ? Data.tranTypeOptions[0].value : undefined;

            if (Data.previousFilter) {
            	this.components.creditFilterActivityComponent.transactionPostedTimeframe = this.dataTransform.isDefined(Data.previousFilter.statementPeriodId) ? Data.previousFilter.statementPeriodId : 'SINCE_LAST_STATEMENT';
            	this.components.creditFilterActivityComponent.transactionType = this.dataTransform.isDefined(Data.previousFilter.filterTranType) ? Data.previousFilter.filterTranType : 'ALL';
            	this.components.creditFilterActivityComponent.transactionPostedFromDate = this.dataTransform.isDefined(Data.previousFilter.dateLo) ? this.dataTransform.convertDate(Data.previousFilter.dateLo) : '';
            	this.components.creditFilterActivityComponent.transactionPostedToDate = this.dataTransform.isDefined(Data.previousFilter.dateHi) ? this.dataTransform.convertDate(Data.previousFilter.dateHi) : '';
            	this.components.creditFilterActivityComponent.merchantName = this.dataTransform.isDefined(Data.previousFilter.filterKeyword) ? Data.previousFilter.filterKeyword : '';
            	this.components.creditFilterActivityComponent.transactionFromAmount = this.dataTransform.isDefined(Data.previousFilter.amountLo) ? Data.previousFilter.amountLo : '';
            	this.components.creditFilterActivityComponent.transactionToAmount = this.dataTransform.isDefined(Data.previousFilter.amountHi) ? Data.previousFilter.amountHi : '';
            }

            this.executeCAV([this.components['creditFilterActivityComponent'], this.accountActivityMapper['CREDITACCOUNTACTIVITYFILTER'].view, {
                append: false,
                target: '#accountActivityFilter',
                react: true
            }]);
        };

        this.executeCAV_SharedMortgageAndLoanActivity = function(inputData) {
            var instanceName = inputData.accountId + 'Activity';
            this.executeCAV([this.components[instanceName], (inputData.accountType === 'LOAN' ? this.accountActivityMapper[inputData.accountType][inputData.detailType].view : this.accountActivityMapper[inputData.accountType].view), {
                append: false,
                target: '#activity-transactions',
                react: true
            }]);
        };
    };
});
