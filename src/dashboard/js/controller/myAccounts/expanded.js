define(function(require) {

    return function expandedController() {
        var controllerChannel = require('blue/event/channel/controller'),
            dynamicContentUtil = require('common/utility/dynamicContentUtil'),
            observable = require('blue/observable'),
            when = require('when/when');

        this.init = function() {

            this.expandedContainerSpec = require('blue-spec/dist/spec/layout');
            this.expandedContainerComponent = require('dashboard/component/myAccounts/mortgageExpanded');
            this.expandedContainerView = 'myAccounts/expandedContainer';

            this.headerContainerSpec = require('bluespec/account_details_header');
            this.headerContainerComponent = require('dashboard/component/myAccounts/accountDetailsHeader');
            this.headerContainerView = 'myAccounts/accountDetailsHeader';

            //heo
            this.heoInterestPaidSpec = require('bluespec/heo_account_interest_analysis');
            this.heoInterestPaidComponent = require('dashboard/component/myAccounts/heoAccountInterestAnalysis');
            this.heoInterestPaidView = 'myAccounts/heoAccountInterestAnalysis';

            this.heoInformationSpec = require('bluespec/heo_account_loan_information');
            this.heoInformationComponent = require('dashboard/component/myAccounts/heoAccountLoanInformation');
            this.heoInformationView = 'myAccounts/heoAccountLoanInformation';

            this.heoAccountRecentPaymentSpec = require('bluespec/heo_account_recent_payment');
            this.heoAccountRecentPaymentComponent = require('dashboard/component/myAccounts/heoAccountRecentPayment');
            this.heoAccountRecentPaymentView = 'myAccounts/heoAccountRecentPayment';


            //Hel Loan
            this.helInformationSpec = require('bluespec/hel_account_information');
            this.helInformationComponent = require('dashboard/component/myAccounts/helAccountInformation');
            this.helInformationView = 'myAccounts/helAccountInformation';

            this.helAccountBalanceSummarySpec = require('bluespec/hel_account_balance_summary');
            this.helAccountBalanceSummaryComponent = require('dashboard/component/myAccounts/helAccountBalanceSummary');
            this.helAccountBalanceSummaryView = 'myAccounts/helAccountBalanceSummary';

            this.helAccountRecentPaymentSpec = require('bluespec/hel_account_recent_payment');
            this.helAccountRecentPaymentComponent = require('dashboard/component/myAccounts/helAccountRecentPayment');
            this.helAccountRecentPaymentView = 'myAccounts/helAccountRecentPayment';

            this.helAccountRateLocksSpec = require('bluespec/hel_account_rate_locks');
            this.helAccountRateLocksComponent = require('dashboard/component/myAccounts/helAccountRateLocks');
            this.helAccountRateLocksView = 'myAccounts/helAccountRateLocks';

            this.helInterestPaidSpec = require('bluespec/hel_account_interest_analysis');
            this.helInterestPaidComponent = require('dashboard/component/myAccounts/helAccountInterestAnalysis');
            this.helInterestPaidView = 'myAccounts/helAccountInterestAnalysis';

            //RCA Loan
            this.rcaAccountCreditInformationSpec = require('bluespec/rca_account_credit_information');
            this.rcaAccountCreditInformationComponent = require('dashboard/component/myAccounts/rcaAccountCreditInformation');
            this.rcaAccountCreditInformationView = 'myAccounts/rcaAccountCreditInformation';

            this.rcaAccountBalanceSummarySpec = require('bluespec/rca_account_balance_summary');
            this.rcaAccountBalanceSummaryComponent = require('dashboard/component/myAccounts/rcaAccountBalanceSummary');
            this.rcaAccountBalanceSummaryView = 'myAccounts/rcaAccountBalanceSummary';

            this.rcaAccountRecentPaymentSpec = require('bluespec/rca_account_recent_payment');
            this.rcaAccountRecentPaymentComponent = require('dashboard/component/myAccounts/rcaAccountRecentPayment');
            this.rcaAccountRecentPaymentView = 'myAccounts/rcaAccountRecentPayment';

            this.rcaInterestPaidSpec = require('bluespec/rca_account_interest_analysis');
            this.rcaInterestPaidComponent = require('dashboard/component/myAccounts/rcaAccountInterestAnalysis');
            this.rcaInterestPaidView = 'myAccounts/rcaAccountInterestAnalysis';

            //Mortgage Loan
            this.mortgageLoanInfoSpec = require('bluespec/mortgage_account_loan_information');
            this.mortgageLoanInfoComponent = require('dashboard/component/myAccounts/mortgageAccountLoanInformation');
            this.mortgageLoanInfoView = 'myAccounts/mortgageAccountLoanInformation';

            this.mortgageRecentPaymentSpec = require('bluespec/mortgage_account_recent_payment');
            this.mortgageRecentPaymentComponent = require('dashboard/component/myAccounts/mortgageAccountRecentPayment');
            this.mortgageRecentPaymentView = 'myAccounts/mortgageAccountRecentPayment';

            this.mortgageEscrowSpec = require('bluespec/mortgage_account_escrow_summary');
            this.mortgageEscrowComponent = require('dashboard/component/myAccounts/mortgageAccountEscrowSummary');
            this.mortgageEscrowView = 'myAccounts/mortgageAccountEscrowSummary';

            this.mortgageCashBackSummarySpec = require('bluespec/mortgage_account_cash_back');
            this.mortgageCashBackSummaryComponent = require('dashboard/component/myAccounts/mortgageAccountCashBack');
            this.mortgageCashBackSummaryView = 'myAccounts/mortgageAccountCashBack';

            this.mortgagePaymentAnalysisSpec = require('bluespec/mortgage_account_payment_analysis');
            this.mortgagePaymentAnalysisComponent = require('dashboard/component/myAccounts/mortgageAccountPaymentAnalysis');
            this.mortgagePaymentAnalysisView = 'myAccounts/mortgageAccountPaymentAnalysis';

            this.cardAccountDetailsMapper = {

                'LAYOUT': {

                    'spec': require('blue-spec/dist/spec/layout'),
                    'component': require('dashboard/component/myAccounts/mortgageExpanded'),
                    'view': 'myAccounts/expandedContainer'
                },
                'ACCOUNTDETAILSHEADER': {
                    'spec': require('bluespec/account_details_header'),
                    'component': require('dashboard/component/myAccounts/accountDetailsHeader'),
                    'view': 'myAccounts/accountDetailsHeader'
                },
                'PREPAIDCARDINFORMATION': {
                    'spec': require('bluespec/prepaid_account_card_information'),
                    'component': require('dashboard/component/myAccounts/prepaidAccountCardInformation'),
                    'view': 'myAccounts/prepaidAccountCardInformation'
                },
                'CARDINFORMATION': {
                    'spec': require('bluespec/credit_account_information'),
                    'component': require('dashboard/component/myAccounts/creditAccountInformation'),
                    'view': 'myAccounts/creditAccountInformation'
                },
                'CARDAPR': {
                    'spec': require('bluespec/credit_account_apr_analysis'),
                    'component': require('dashboard/component/myAccounts/creditAccountAprAnalysis'),
                    'view': 'myAccounts/creditAccountAprAnalysis'
                },
                'CARDCASHADVANCE': {
                    'spec': require('bluespec/credit_account_cash_advance_analysis'),
                    'component': require('dashboard/component/myAccounts/creditAccountCashAdvanceAnalysis'),
                    'view': 'myAccounts/creditAccountCashAdvanceAnalysis'
                },
                'CARDRECENTPAYMENT': {
                    'spec': require('bluespec/credit_account_recent_payment'),
                    'component': require('dashboard/component/myAccounts/creditAccountRecentPayment'),
                    'view': 'myAccounts/creditAccountRecentPayment'
                },
                'CARDULTIMATEREWARDS': {
                    'spec': require('bluespec/credit_account_ultimate_rewards'),
                    'component': require('dashboard/component/myAccounts/creditAccountUltimateRewards'),
                    'view': 'myAccounts/creditAccountUltimateRewards'
                }
            };

            this.appChannel.on({
                'getExpandedHeo': function(inputData) {
                    this.getExpandedHeo(inputData);
                }.bind(this)
            });

            this.appChannel.on({
                'getExpandedCard': function(inputData) {
                    this.getExpandedCard(inputData);
                }.bind(this)
            });

            this.appChannel.on({
                'accountDetailsPrepaid': function(inputData) {
                    this.accountDetailsPrepaid(inputData);
                }.bind(this)
            });

            this.appChannel.on({
                'getExpandedHeloc': function(inputData) {
                    this.getExpandedHeloc(inputData);
                }.bind(this)
            });

            this.appChannel.on({
                'getExpandedMortgage': function(inputData) {
                    this.getExpandedMortgage(inputData);
                }.bind(this)
            });

            this.appChannel.on({
                'getExpandedRcaLoan': function(inputData) {
                    this.getExpandedRcaLoan(inputData);
                }.bind(this)
            });

        };

        /*
         *
         */

        this.index = function() {};

        this.accountDetailsPrepaid = function(inputData) {

        	var svcType, componentCollection =[],
        		accountId = inputData.accountId,
        		accountType = inputData.accountType;

        	this.register.components(this, [{
        		name: 'prepaidLayoutComponent',
	            model: observable.Model({}),
	            spec: this.cardAccountDetailsMapper['LAYOUT'].spec,
	            methods: this.cardAccountDetailsMapper['LAYOUT'].component
        	}]);
        	componentCollection.push([this.components.prepaidLayoutComponent, this.cardAccountDetailsMapper['LAYOUT'].view, {
                'target': '#content',
                'react': true
            }]);

            var prepaidModel = observable.Model({
                	accountDisplayName: this.dataTransform.getTitleCase(inputData.accountName) + ' ' + inputData.accountMaskNumber,
                	accountId: accountId
                });

            this.register.components(this, [{
        		name: 'predaidAccountHeaderComponent',
	            model: prepaidModel,
	            spec: this.cardAccountDetailsMapper['ACCOUNTDETAILSHEADER'].spec,
	            methods: this.cardAccountDetailsMapper['ACCOUNTDETAILSHEADER'].component
        	}]);
        	this.components.predaidAccountHeaderComponent.output.emit('state', {
                target: this,
                value: 'asOfDateHide'
            });
        	componentCollection.push([this.components.predaidAccountHeaderComponent, this.cardAccountDetailsMapper['ACCOUNTDETAILSHEADER'].view, {
                'append': false,
                'target': '#containerContent',
                'react': true
            }]);

            svcType = this.serviceNameMapper.getServiceNames('ACCOUNT_TYPE_MAPPER')[accountType];
            this.expandedServices.expanded[svcType.prepaidOwnerSvc]({
            	'accountId': accountId
            }).then(function(data) {
            	var cardNamesList;
            	cardNamesList = this.dataTransform.prepaidOwnerData(data.cardNames);
            	var prepaidModel = observable.Model({
                	cardNamesList: cardNamesList
                });
            	this.register.components(this, [{
	        		name: 'predaidAccountCardInformationComponent',
		            model: prepaidModel,
		            spec: this.cardAccountDetailsMapper['PREPAIDCARDINFORMATION'].spec,
		            methods: this.cardAccountDetailsMapper['PREPAIDCARDINFORMATION'].component
	        	}]);
	        	componentCollection.push([this.components.predaidAccountCardInformationComponent, this.cardAccountDetailsMapper['PREPAIDCARDINFORMATION'].view, {
	                'append': true,
	                'target': '#containerContent',
	                'react': true
	            }]);
	            this.executeCAV(componentCollection);
            }.bind(this));

        };

        this.getExpandedCard = function(inputData) {
            var svcType, deferred = [],
                reward, componentCollection = [],
                accountId = inputData.accountId,
                accountType = inputData.accountType;

            this.register.components(this, [{
                name: 'creditLayoutComponent',
                model: observable.Model({}),
                spec: this.cardAccountDetailsMapper['LAYOUT'].spec,
                methods: this.cardAccountDetailsMapper['LAYOUT'].component
            }]);

            componentCollection.push([this.components.creditLayoutComponent, this.cardAccountDetailsMapper['LAYOUT'].view, {
                'target': '#content',
                'react': true
            }]);

            svcType = this.serviceNameMapper.getServiceNames('ACCOUNT_TYPE_MAPPER')[accountType];
            deferred.push(this.expandedServices.expanded[svcType.rewardSvc]({
                'accountId': accountId
            }).then(function(rewardData) {
                var cardDataModel = observable.Model({
                    ultimateRewardsEarned: rewardData.rewardBalance + ' pts'
                });
                reward = rewardData.rewardBalance;
                this.register.components(this, [{
                    name: 'creditAccountUltimateRewardsComponent',
                    model: cardDataModel,
                    spec: this.cardAccountDetailsMapper['CARDULTIMATEREWARDS'].spec,
                    methods: this.cardAccountDetailsMapper['CARDULTIMATEREWARDS'].component
                }]);
            }.bind(this)));
            deferred.push(this.expandedServices.expanded[svcType.detailSvc]({

                'accountId': accountId
            }).then(function(detailData) {

                detailData = this.dataTransform.cardDetailData(detailData);

                var cardDataModel = observable.Model({
                    accountDisplayName: detailData.displayName,
                    accountId: accountId
                });
                this.register.components(this, [{
	        		name: 'creditAccountHeaderComponent',
		            model: cardDataModel,
		            spec: this.cardAccountDetailsMapper['ACCOUNTDETAILSHEADER'].spec,
		            methods: this.cardAccountDetailsMapper['ACCOUNTDETAILSHEADER'].component
	        	}]);
	        	this.components.creditAccountHeaderComponent.output.emit('state', {
                    target: this,
                    value: 'asOfDateHide'
                });

                var cardDataModel = observable.Model({
                    accountOutstandingBalance: detailData.detail.currentBalance,
                    accountPendingCharges: detailData.detail.pendingChargesAmount,
                    accountAvailableCreditBalance: detailData.detail.availableCredit,
                    accountCreditLimit: detailData.detail.creditLimit,
                    accountStatementGenerationDate: detailData.detail.nextPaymentDueDate,
                    lastStmMsg: detailData.lastStmMsg
                });
                this.register.components(this, [{

                    name: 'creditAccountInfoComponent',
                    model: cardDataModel,
                    spec: this.cardAccountDetailsMapper['CARDINFORMATION'].spec,
                    methods: this.cardAccountDetailsMapper['CARDINFORMATION'].component
                }]);

                var cardDataModel = observable.Model({
                    lastPaymentMsg: detailData.lastPaymentMsg,
                    minPaymentMsg: detailData.minPaymentMsg,
                    blueprintNextPaymentAmount: detailData.detail.blueprintNextPaymentAmount,
                    blueprintEnrolled: detailData.detail.blueprintEnrolled
                });
                this.register.components(this, [{

                    name: 'creditAccountRecentPaymentComponent',
                    model: cardDataModel,
                    spec: this.cardAccountDetailsMapper['CARDRECENTPAYMENT'].spec,
                    methods: this.cardAccountDetailsMapper['CARDRECENTPAYMENT'].component
                }]);

                var cardDataModel = observable.Model({
                    accountCashAdvanceBalance: detailData.detail.cardCashAdvanceBalance,
                    accountAvailableCashAdvanceBalance: detailData.detail.cashAdvanceBalance,
                    accountCashAdvanceLimit: detailData.detail.cashAdvanceLimit
                });
                this.register.components(this, [{
                    name: 'creditAccountCashAdvanceAnalysisComponent',
                    model: cardDataModel,
                    spec: this.cardAccountDetailsMapper['CARDCASHADVANCE'].spec,
                    methods: this.cardAccountDetailsMapper['CARDCASHADVANCE'].component
                }]);

                var cardDataModel = observable.Model({
                    purchaseApr: detailData.detail.purchaseAPR,
                    cashApr: detailData.detail.cashAPR
                });
                this.register.components(this, [{
                    name: 'creditAccountAprAnalysisComponent',
                    model: cardDataModel,
                    spec: this.cardAccountDetailsMapper['CARDAPR'].spec,
                    methods: this.cardAccountDetailsMapper['CARDAPR'].component
                }]);
                dynamicContentUtil.dynamicContent.set(this.components.creditAccountAprAnalysisComponent, 'apr_analysis_header', {
                    aprHeader: detailData.aprHeaderMsg
                });
       		}.bind(this))
			);
			when.all(deferred).then(function (){
				componentCollection.push([this.components.creditAccountHeaderComponent, this.cardAccountDetailsMapper['ACCOUNTDETAILSHEADER'].view, {
                    'append': false,
                    'target': '#containerContent',
                    'react': true
                }]);
                componentCollection.push([this.components.creditAccountInfoComponent, this.cardAccountDetailsMapper['CARDINFORMATION'].view, {
                    'append': true,
                    'target': '#containerContent',
                    'react': true

                }]);
                componentCollection.push([this.components.creditAccountRecentPaymentComponent, this.cardAccountDetailsMapper['CARDRECENTPAYMENT'].view, {
                    'append': true,
                    'target': '#containerContent',
                    'react': true
                }]);

                // Need change for the condition
                if (this.dataTransform.isDefined(reward)) {
                    componentCollection.push([this.components.creditAccountUltimateRewardsComponent, this.cardAccountDetailsMapper['CARDULTIMATEREWARDS'].view, {
                        'append': true,
                        'target': '#containerContent',
                        'react': true
                    }]);
                }

                componentCollection.push([this.components.creditAccountCashAdvanceAnalysisComponent, this.cardAccountDetailsMapper['CARDCASHADVANCE'].view, {
                    'append': true,
                    'target': '#containerContent',
                    'react': true
                }]);
                componentCollection.push([this.components.creditAccountAprAnalysisComponent, this.cardAccountDetailsMapper['CARDAPR'].view, {
                    'append': true,
                    'target': '#containerContent',
                    'react': true
                }]);
                this.executeCAV(componentCollection);
            }.bind(this));
        };

        this.getExpandedRcaLoan = function(inputData) {
            var componentCollection = [];

            this.expandedServices.expanded['accounts.rca.expanded.svc']({
                'accountId': inputData.accountId
            }).then(function(detailData) {

                var expandedContainerModel = observable.Model({});

                this.register.components(this, [{
                    name: 'expandedContainer',
                    model: expandedContainerModel,
                    spec: this.expandedContainerSpec,
                    methods: this.expandedContainerComponent
                }]);

                componentCollection.push([this.components.expandedContainer, this.expandedContainerView, {
                    'target': '#content',
                    'react': true
                }]);

                //get data from service in local object
                detailData = this.dataTransform.helocDetailData(detailData);

                //RCAHeader component
                var detailHeaderDataModel = observable.Model({
                    accountDisplayName: detailData.nickname + ' (' + detailData.mask + ')',
                    accountId: detailData.accountId

                });

                this.register.components(this, [{

                    name: 'DetailHeader',
                    model: detailHeaderDataModel,
                    spec: this.headerContainerSpec,
                    methods: this.headerContainerComponent
                }]);

                // dynamicContentUtil.dynamicContent.set(this.components.DetailHeader, 'account_details_header', {
                //     accDetHeader: detailData.nickname + ' (' + detailData.mask + ')'
                // });

                dynamicContentUtil.dynamicContent.set(this.components.DetailHeader, 'account_update_date_label', {
                    headerDate: detailData.detail.asOfDate

                });

                componentCollection.push([this.components.DetailHeader, this.headerContainerView, {
                    //'append': true,
                    'append': false,
                    'react': true,
                    'target': '#containerContent'
                }]);


                //RCA Info
                var rcaInfoDataModel = observable.Model({
                    primaryBorrowerName: detailData.detail.primaryFullName,
                    secondaryBorrowerName: detailData.detail.secondaryFullName,
                    addressLine1: detailData.detail.mailingAddress.addressLine1,
                    addressLine2: detailData.detail.mailingAddress.addressLine2,
                    city: detailData.detail.mailingAddress.city,
                    state: detailData.detail.mailingAddress.state,
                    zipCode: detailData.detail.mailingAddress.zipCode,
                    zipCodeExt: detailData.detail.mailingAddress.zipCodeExt,
                    postalAddress: detailData.detail.postalAddress,
                    phoneNumber: detailData.detail.homePhoneNumber,
                    interestRate: detailData.detail.interestRate,
                    loanOriginationDate: detailData.detail.originationDate,
                    originalLoanAmount: detailData.detail.originationLoanAmount
                });

                this.register.components(this, [{
                    name: 'RcaInfo',
                    model: rcaInfoDataModel,
                    spec: this.rcaAccountCreditInformationSpec,
                    methods: this.rcaAccountCreditInformationComponent
                }]);

                dynamicContentUtil.dynamicContent.set(this.components.RcaInfo, 'interest_type_label', {
                    interestRate: detailData.detail.interestRate
                });

                if (!detailData.detail.secondaryFullName) {

                    this.components.RcaInfo.output.emit('state', {
                        target: this,
                        value: 'secondaryName'
                    });

                }

                componentCollection.push([this.components.RcaInfo, this.rcaAccountCreditInformationView, {
                    'append': true,
                    'react': true,
                    'target': '#containerContent'
                }]);

                //RCA Balance Summary
                var rcaBalanceSummaryDataModel = observable.Model({
                    accountPrincipalBalance: detailData.detail.principalBalance,
                    feesAndCharges: detailData.detail.paydownFees,
                    interestAccrued: detailData.detail.interestBalanceTotal,
                    accountCurrentBalance: detailData.detail.currentBalance,
                    accountAvailableCreditBalance: detailData.detail.availableCredit,
                });

                this.register.components(this, [{
                    name: 'RcaBalanceSummary',
                    model: rcaBalanceSummaryDataModel,
                    spec: this.rcaAccountBalanceSummarySpec,
                    methods: this.rcaAccountBalanceSummaryComponent
                }]);

                dynamicContentUtil.dynamicContent.set(this.components.RcaBalanceSummary, 'variable_interest_type_label', {
                    variableInterest: detailData.detail.interestBalanceVariable
                });

                componentCollection.push([this.components.RcaBalanceSummary, this.rcaAccountBalanceSummaryView, {
                    'append': true,
                    'react': true,
                    'target': '#containerContent'
                }]);

                //RCA Recent Account Payment
                var rcaRecentPaymentModel = observable.Model({});

                this.register.components(this, [{
                    name: 'RcaRecentPayment',
                    model: rcaRecentPaymentModel,
                    spec: this.rcaAccountRecentPaymentSpec,
                    methods: this.rcaAccountRecentPaymentComponent
                }]);

                dynamicContentUtil.dynamicContent.set(this.components.RcaRecentPayment, 'last_payment_join_label', {
                    lastPaymentAmount: detailData.detail.lastPaymentAmount,
                    lastPaymentDate: detailData.detail.lastPaymentDate
                });
                dynamicContentUtil.dynamicContent.set(this.components.RcaRecentPayment, 'next_payment_join_label', {
                    nextPaymentDueAmount: detailData.detail.nextPaymentAmount,
                    nextPaymentDueDate: detailData.detail.nextPaymentDate
                });

                componentCollection.push([this.components.RcaRecentPayment, this.rcaAccountRecentPaymentView, {
                    'append': true,
                    'react': true,
                    'target': '#containerContent'
                }]);

                //RCA interest paid
                var rcaInterestDataModel = observable.Model({
                    interestPaidInCurrentYear: detailData.detail.interestPaidYTD,
                    interestPaidInPreviousYear: detailData.detail.interestPaidLastYear,
                    currentYear: detailData.detail.presentYear,
                    previousYear: detailData.detail.lastYear
                });

                this.register.components(this, [{
                    name: 'RcaInterest',
                    model: rcaInterestDataModel,
                    spec: this.rcaInterestPaidSpec,
                    methods: this.rcaInterestPaidComponent
                }]);

                dynamicContentUtil.dynamicContent.set(this.components.RcaInterest, 'interest_paid_in_current_year_label', {
                    current_year: detailData.detail.presentYear
                });

                dynamicContentUtil.dynamicContent.set(this.components.RcaInterest, 'interest_paid_in_previous_year_label', {
                    previous_year: detailData.detail.lastYear
                });

                componentCollection.push([this.components.RcaInterest, this.rcaInterestPaidView, {
                    'append': true,
                    'react': true,
                    'target': '#containerContent'
                }]);

                controllerChannel.emit('setProfileHeader', {
                    headerLabel: ' '
                });


                this.executeCAV(componentCollection);

            }.bind(this));
        };

        this.getExpandedHeo = function(inputData) {
            var componentCollection = [];

            this.expandedServices.expanded['accounts.heo.expanded.svc']({
                'accountId': inputData.accountId
            }).then(function(detailData) {

                var expandedContainerModel = observable.Model({});

                this.register.components(this, [{
                    name: 'expandedContainer',
                    model: expandedContainerModel,
                    spec: this.expandedContainerSpec,
                    methods: this.expandedContainerComponent
                }]);

                componentCollection.push([this.components.expandedContainer, this.expandedContainerView, {
                    'target': '#content',
                    'react': true
                }]);

                // get data from service in local object
                detailData = this.dataTransform.helocDetailData(detailData);

                //Header component
                var detailHeaderDataModel = observable.Model({
                    accountDisplayName: detailData.nickname + ' (' + detailData.mask + ')',
                    accountUpdateDate: detailData.detail.asOfDate,
                    accountId: detailData.accountId
                });

                this.register.components(this, [{
                    name: 'DetailHeader',
                    model: detailHeaderDataModel,
                    spec: this.headerContainerSpec,
                    methods: this.headerContainerComponent
                }]);


                dynamicContentUtil.dynamicContent.set(this.components.DetailHeader, 'account_update_date_label', {
                    headerDate: detailData.detail.asOfDate
                });

                componentCollection.push([this.components.DetailHeader, this.headerContainerView, {
                    //'append': true,
                    'append': false,
                    'react': true,
                    'target': '#containerContent'
                }]);


                //Heo Info
                var heoInfoDataModel = observable.Model({
                    primaryBorrowerName: detailData.detail.primaryFullName,

                    addressLine1: detailData.detail.mailingAddress.addressLine1,
                    addressLine2: detailData.detail.mailingAddress.addressLine2,
                    city: detailData.detail.mailingAddress.city,
                    state: detailData.detail.mailingAddress.state,
                    zipCode: detailData.detail.mailingAddress.zipCode,
                    zipCodeExt: detailData.detail.mailingAddress.zipCodeExt,
                    postalAddress: detailData.detail.postalAddress,

                    phoneNumber: detailData.detail.homePhoneNumber,
                    secondaryBorrowerName: detailData.detail.secondaryFullName,
                    loanOriginationDate: detailData.detail.originationDate,
                    originationLoanAmount: detailData.detail.originationLoanAmount,
                    totalMonthlyPayments: detailData.detail.paymentsMade,
                    accountPrincipalBalance: detailData.detail.principalBalance,
                    interestRate: detailData.detail.interestRate,
                    interestBalanceTotal: detailData.detail.interestBalanceTotal,
                    feesAndCharges: detailData.detail.paydownFees
                });

                this.register.components(this, [{
                    name: 'HeoLoanInfo',
                    model: heoInfoDataModel,
                    spec: this.heoInformationSpec,
                    methods: this.heoInformationComponent
                }]);


                dynamicContentUtil.dynamicContent.set(this.components.HeoLoanInfo, 'interest_type_label', {
                    interestRate: detailData.detail.interestRate
                });
                if (!detailData.detail.secondaryFullName) {

                    this.components.HeoLoanInfo.output.emit('state', {
                        target: this,
                        value: 'secondaryName'
                    });

                }

                componentCollection.push([this.components.HeoLoanInfo, this.heoInformationView, {
                    'append': true,
                    'react': true,
                    'target': '#containerContent'
                }]);


                //HeoRecent Account Payment
                var heoRecentPaymentModel = observable.Model({});

                this.register.components(this, [{
                    name: 'HeoRecentPayment',
                    model: heoRecentPaymentModel,
                    spec: this.heoAccountRecentPaymentSpec,
                    methods: this.heoAccountRecentPaymentComponent
                }]);

                dynamicContentUtil.dynamicContent.set(this.components.HeoRecentPayment, 'last_payment_join_label', {
                    lastPaymentAmount: detailData.detail.lastPaymentAmount,
                    lastPaymentDate: detailData.detail.lastPaymentDate
                });
                dynamicContentUtil.dynamicContent.set(this.components.HeoRecentPayment, 'next_payment_join_label', {
                    nextPaymentDueAmount: detailData.detail.nextPaymentAmount,
                    nextPaymentDueDate: detailData.detail.nextPaymentDate
                });

                componentCollection.push([this.components.HeoRecentPayment, this.heoAccountRecentPaymentView, {
                    'append': true,
                    'react': true,
                    'target': '#containerContent'
                }]);


                //Heo interest paid
                var heoInterestDataModel = observable.Model({
                    interestPaidInCurrentYear: detailData.detail.interestPaidYTD,
                    interestPaidInPreviousYear: detailData.detail.interestPaidLastYear,
                    currentYear: detailData.detail.presentYear,
                    previousYear: detailData.detail.lastYear
                });

                this.register.components(this, [{
                    name: 'HeoInterest',
                    model: heoInterestDataModel,
                    spec: this.heoInterestPaidSpec,
                    methods: this.heoInterestPaidComponent
                }]);

                dynamicContentUtil.dynamicContent.set(this.components.HeoInterest, 'interest_paid_in_current_year_label', {
                    current_year: detailData.detail.presentYear
                });

                dynamicContentUtil.dynamicContent.set(this.components.HeoInterest, 'interest_paid_in_previous_year_label', {
                    previous_year: detailData.detail.lastYear
                });

                componentCollection.push([this.components.HeoInterest, this.heoInterestPaidView, {
                    'append': true,
                    'react': true,
                    'target': '#containerContent'
                }]);

                controllerChannel.emit('setProfileHeader', {
                    headerLabel: ' '
                });


                this.executeCAV(componentCollection);

            }.bind(this));
        };


        this.getExpandedHeloc = function(inputData) {
            var componentCollection = [];

            this.expandedServices.expanded['accounts.loan.expanded.svc']({
                'accountId': inputData.accountId
            }).then(function(detailData) {

                var expandedContainerModel = observable.Model({});

                this.register.components(this, [{
                    name: 'expandedContainer',
                    model: expandedContainerModel,
                    spec: this.expandedContainerSpec,
                    methods: this.expandedContainerComponent
                }]);

                componentCollection.push([this.components.expandedContainer, this.expandedContainerView, {
                    'target': '#content',
                    'react': true
                }]);

                //get data from service in local object
                detailData = this.dataTransform.helocDetailData(detailData);

                //Header component
                var detailHeaderDataModel = observable.Model({
                    accountDisplayName: detailData.nickname + ' (' + detailData.mask + ')',
                    accountUpdateDate: detailData.detail.asOfDate,
                    accountId: detailData.accountId
                });

                this.register.components(this, [{
                    name: 'DetailHeader',
                    model: detailHeaderDataModel,
                    spec: this.headerContainerSpec,
                    methods: this.headerContainerComponent
                }]);

                dynamicContentUtil.dynamicContent.set(this.components.DetailHeader, 'account_details_header', {
                    accDetHeader: detailData.nickname + ' (' + detailData.mask + ')'
                });

                dynamicContentUtil.dynamicContent.set(this.components.DetailHeader, 'account_update_date_label', {
                    headerDate: detailData.detail.asOfDate
                });

                componentCollection.push([this.components.DetailHeader, this.headerContainerView, {
                    //'append': true,
                    'append': false,
                    'react': true,
                    'target': '#containerContent'
                }]);


                //Hel Info
                var helInfoDataModel = observable.Model({
                	'accountId': detailData.accountId,
                    primaryBorrowerName: detailData.detail.primaryFullName,
                    secondaryBorrowerName: detailData.detail.secondaryFullName,
                    addressLine1: detailData.detail.mailingAddress.addressLine1,
                    addressLine2: detailData.detail.mailingAddress.addressLine2,
                    city: detailData.detail.mailingAddress.city,
                    state: detailData.detail.mailingAddress.state,
                    zipCode: detailData.detail.mailingAddress.zipCode,
                    zipCodeExt: detailData.detail.mailingAddress.zipCodeExt,
                    postalAddress: detailData.detail.postalAddress,
                    phoneNumber: detailData.detail.homePhoneNumber,
                    interestRate: detailData.detail.interestRate,
                    loanOriginationDate: detailData.detail.originationDate,
                    originalLoanAmount: detailData.detail.originalCreditLine
                });

                this.register.components(this, [{
                    name: 'HelInfo',
                    model: helInfoDataModel,
                    spec: this.helInformationSpec,
                    methods: this.helInformationComponent
                }]);

                dynamicContentUtil.dynamicContent.set(this.components.HelInfo, 'interest_type_label', {
                    interestRate: detailData.detail.interestRate
                });

                dynamicContentUtil.dynamicContent.set(this.components.HelInfo, 'update_payment_due_date_label', {
                    currentPaymentDate: detailData.detail.currentPaymentDate
                });

                if (!detailData.detail.secondaryFullName) {

                    this.components.HelInfo.output.emit('state', {
                        target: this,
                        value: 'secondaryName'
                    });

                }

                componentCollection.push([this.components.HelInfo, this.helInformationView, {
                    'append': true,
                    'react': true,
                    'target': '#containerContent'
                }]);

                //Balance Summary
                var helBalanceSummaryDataModel = observable.Model({
                    accountPrincipalBalance: detailData.detail.principalBalance,
                    feesAndCharges: detailData.detail.paydownFees,
                    interestAccrued: detailData.detail.interestBalanceTotal,
                    accountCurrentBalance: detailData.detail.currentBalance,
                    variableInterestAccrued: detailData.detail.interestBalanceVariable,
                    accountAvailableCreditBalance: detailData.detail.availableCredit,
                    accountAvailableLockBalance: detailData.detail.rateLockTotalBalance
                });

                this.register.components(this, [{
                    name: 'HelBalanceSummary',
                    model: helBalanceSummaryDataModel,
                    spec: this.helAccountBalanceSummarySpec,
                    methods: this.helAccountBalanceSummaryComponent
                }]);

                dynamicContentUtil.dynamicContent.set(this.components.HelBalanceSummary, 'variable_interest_type_label', {
                    variableInterest: detailData.detail.interestBalanceVariable
                });

                componentCollection.push([this.components.HelBalanceSummary, this.helAccountBalanceSummaryView, {
                    'append': true,
                    'react': true,
                    'target': '#containerContent'
                }]);

                //Hel Recent Account Payment
                var helRecentPaymentModel = observable.Model({});

                this.register.components(this, [{
                    name: 'HelRecentPayment',
                    model: helRecentPaymentModel,
                    spec: this.helAccountRecentPaymentSpec,
                    methods: this.helAccountRecentPaymentComponent
                }]);

                dynamicContentUtil.dynamicContent.set(this.components.HelRecentPayment, 'last_payment_join_label', {
                    lastPaymentAmount: detailData.detail.lastPaymentAmount,
                    lastPaymentDate: detailData.detail.lastPaymentDate
                });
                dynamicContentUtil.dynamicContent.set(this.components.HelRecentPayment, 'next_payment_join_label', {
                    nextPaymentDueAmount: detailData.detail.nextPaymentAmount,
                    nextPaymentDueDate: detailData.detail.nextPaymentDate
                });

                componentCollection.push([this.components.HelRecentPayment, this.helAccountRecentPaymentView, {
                    'append': true,
                    'react': true,
                    'target': '#containerContent'
                }]);

                //Hel Rate Locks
                if (detailData.detail.rateLocks != null && detailData.detail.rateLocks !== undefined) {
                    var helRateLocksModel = observable.Model({}),
                        locks;

                    this.register.components(this, [{
                        name: 'HelRateLocks',
                        model: helRateLocksModel,
                        spec: this.helAccountRateLocksSpec,
                        methods: this.helAccountRateLocksComponent
                    }]);

                    locks = this.dataTransform.rateLocksDetail(detailData.detail);

                    this.components.HelRateLocks.rateLocks = locks;

                    componentCollection.push([this.components.HelRateLocks, this.helAccountRateLocksView, {
                        'append': true,
                        'react': true,
                        'target': '#containerContent'
                    }]);
                }

                //Hel interest paid
                var helInterestDataModel = observable.Model({
                    interestPaidInCurrentYear: detailData.detail.interestPaidYTD,
                    interestPaidInPreviousYear: detailData.detail.interestPaidLastYear,
                    currentYear: detailData.detail.presentYear,
                    previousYear: detailData.detail.lastYear
                });

                this.register.components(this, [{
                    name: 'HelInterest',
                    model: helInterestDataModel,
                    spec: this.helInterestPaidSpec,
                    methods: this.helInterestPaidComponent
                }]);

                dynamicContentUtil.dynamicContent.set(this.components.HelInterest, 'interest_paid_in_current_year_label', {
                    current_year: detailData.detail.presentYear
                });

                dynamicContentUtil.dynamicContent.set(this.components.HelInterest, 'interest_paid_in_previous_year_label', {
                    previous_year: detailData.detail.lastYear
                });

                componentCollection.push([this.components.HelInterest, this.helInterestPaidView, {
                    'append': true,
                    'react': true,
                    'target': '#containerContent'
                }]);

                controllerChannel.emit('setProfileHeader', {
                    headerLabel: ' '
                });


                this.executeCAV(componentCollection);

            }.bind(this));
        };


        this.getExpandedMortgage = function(inputData) {
            var componentCollection = [];

            this.expandedServices.expanded['accounts.mortgage.expanded.svc']({
                'accountId': inputData.accountId
            }).then(function(detailData) {

                var expandedContainerModel = observable.Model({});

                this.register.components(this, [{
                    name: 'expandedContainer',
                    model: expandedContainerModel,
                    spec: this.expandedContainerSpec,
                    methods: this.expandedContainerComponent
                }]);

                componentCollection.push([this.components.expandedContainer, this.expandedContainerView, {
                    'target': '#content',
                    'react': true
                }]);

                //get data from service in local object
                detailData = this.dataTransform.mortgageDetailData(detailData);

                //Header component
                var detailHeaderDataModel = observable.Model({
                    accountDisplayName: detailData.nickname + ' (' + detailData.mask + ')',
                    accountId: inputData.accountId
                });

                this.register.components(this, [{
                    name: 'DetailHeader',
                    model: detailHeaderDataModel,
                    spec: this.headerContainerSpec,
                    methods: this.headerContainerComponent
                }]);

                dynamicContentUtil.dynamicContent.set(this.components.DetailHeader, 'account_details_header', {
                    accDetHeader: detailData.nickname + ' (' + detailData.mask + ')'
                });


                this.components.DetailHeader.output.emit('state', {
                    target: this,
                    value: 'asOfDateHide'
                });



                componentCollection.push([this.components.DetailHeader, this.headerContainerView, {
                    'append': false,
                    'react': true,
                    'target': '#containerContent'
                }]);

                //Loan Info
                var loanInfoDataModel = observable.Model({
                    addressLine1: detailData.propertyAddress.addressLine1,
                    addressLine2: detailData.propertyAddress.addressLine2,
                    city: detailData.propertyAddress.city,
                    state: detailData.propertyAddress.state,
                    zipCode: detailData.propertyAddress.zipCode,
                    originalAppraisalAmount: detailData.detail.originalAppraisalAmount,
                    interestType: detailData.detail.productTypeDescription,
                    interestRate: detailData.detail.interestRate,
                    productTypeCode: detailData.detail.productTypeCode,
                    originalLoanDate: detailData.detail.originalLoanDate,
                    originalPayOffDate: detailData.detail.originalPayoffDate,
                    originalLoanAmount: detailData.detail.originalLoanAmount,
                    totalMonthlyPaymentsTillDate: detailData.detail.numOfPaymentsMade,
                    totalMonthlyPayments: detailData.detail.originalNumOfPayments,
                    accountPrincipalBalance: detailData.detail.balance,
                    variableInterestIndexRate: detailData.detail.armIndexRate,
                    variableInterestMargin: detailData.detail.armMarginRate,
                    variableInterestIndex: detailData.detail.armIndexName,
                    armTotalInterestRate: detailData.detail.armTotalInterestRate,
                    interestRateChangeEffectiveDate: detailData.detail.rateChangeDate,
                    paymentChangeEffectiveDate: detailData.detail.paymentChangeDate
                });

                this.register.components(this, [{
                    name: 'LoanInfo',
                    model: loanInfoDataModel,
                    spec: this.mortgageLoanInfoSpec,
                    methods: this.mortgageLoanInfoComponent
                }]);

                dynamicContentUtil.dynamicContent.set(this.components.LoanInfo, 'index_rate_advisory', {
                    indexName: detailData.detail.armIndexName
                });

                dynamicContentUtil.dynamicContent.set(this.components.LoanInfo, 'montly_payments_connector_label', {
                    totalMonthlyPaymentsTillDate: detailData.detail.numOfPaymentsMade,
                    totalMonthlyPayments: detailData.detail.originalNumOfPayments
                });

                switch (detailData.detail.productTypeCode) {
                    case 'FIXED':
                        this.components.LoanInfo.output.emit('state', {
                            target: this,
                            value: 'adjustableInterest'
                        });
                        break;
                    case 'ARM':
                        this.components.LoanInfo.output.emit('state', {
                            target: this,
                            value: 'fixedInterest'
                        });
                        break;
                    default:
                        this.components.LoanInfo.output.emit('state', {
                            target: this,
                            value: 'adjustableInterest'
                        });
                        break;
                }

                componentCollection.push([this.components.LoanInfo, this.mortgageLoanInfoView, {
                    'append': true,
                    'react': true,
                    'target': '#containerContent'
                }]);


                //Recent payment
                var recentPaymentDataModel = observable.Model({
                    lastPaymentAmount: detailData.detail.lastPaymentAmount,
                    lastPaymentDate: detailData.detail.lastPaymentDate,
                    nextPaymentDueAmount: detailData.detail.nextPaymentAmount,
                    nextPaymentDueDate: detailData.detail.nextPaymentDate,
                    paymentLateFees: detailData.detail.lateFees,
                    paymentGraceDays: detailData.detail.gracePeriod,
                    automaticPaymentStatus: detailData.detail.autoPayIndicator,
                    nextAutomaticPaymentDueDate: detailData.detail.nextAutoPaymentDate,
                    latePaymentWarning: detailData.detail.activeMilitaryIndicator
                });


                this.register.components(this, [{
                    name: 'RecentPaymentInfo',
                    model: recentPaymentDataModel,
                    spec: this.mortgageRecentPaymentSpec,
                    methods: this.mortgageRecentPaymentComponent
                }]);

                dynamicContentUtil.dynamicContent.set(this.components.RecentPaymentInfo, 'last_payment_join_label', {
                    lastPaymentAmount: detailData.detail.lastPaymentAmount,
                    lastPaymentDate: detailData.detail.lastPaymentDate
                });

                dynamicContentUtil.dynamicContent.set(this.components.RecentPaymentInfo, 'next_payment_join_label', {
                    nextPaymentDueAmount: detailData.detail.nextPaymentAmount,
                    nextPaymentDueDate: detailData.detail.nextPaymentDate
                });

                dynamicContentUtil.dynamicContent.set(this.components.RecentPaymentInfo, 'late_payment_warning', {
                    lateFee: detailData.detail.lateFees,
                    days: detailData.detail.gracePeriod
                });

                dynamicContentUtil.dynamicContent.set(this.components.RecentPaymentInfo, 'automatic_payment_advisory', {
                    autoPay: detailData.detail.nextAutoPaymentDate
                });

                if (detailData.detail.activeMilitaryIndicator) {
                    this.components.RecentPaymentInfo.output.emit('state', {
                        target: this,
                        value: 'lateFeesHide'
                    });
                }

                if (detailData.detail.autoPayIndicator === 'Off') {
                    this.components.RecentPaymentInfo.output.emit('state', {
                        target: this,
                        value: 'autoPaymentHide'
                    });
                }

                componentCollection.push([this.components.RecentPaymentInfo, this.mortgageRecentPaymentView, {
                    'append': true,
                    'react': true,
                    'target': '#containerContent'
                }]);

                //Escrow
                var escrowDataModel = observable.Model({
                    escrowBalance: detailData.detail.escrowCurrentBalance,
                    lastEscrowAnalysisDate: detailData.detail.lastEscrowAnalysisDate
                });

                this.register.components(this, [{
                    name: 'escrowInfo',
                    model: escrowDataModel,
                    spec: this.mortgageEscrowSpec,
                    methods: this.mortgageEscrowComponent
                }]);

                componentCollection.push([this.components.escrowInfo, this.mortgageEscrowView, {
                    'append': true,
                    'react': true,
                    'target': '#containerContent'
                }]);

                //cash back
                var cashBackBalance;

                if (this.dataTransform.isDefined(detailData.rewardInfo)) {
                    switch (detailData.rewardInfo.status) {
                        case 'ENROLLED':
                            cashBackBalance = detailData.rewardInfo.earnings;
                            break;
                        case 'CANCELLED':
                            cashBackBalance = 'CANCELLED';
                            break;
                        default:
                            cashBackBalance = null;
                            break;

                    }
                    if (cashBackBalance) {
                        var dataModel = observable.Model({
                                cashBackBalance: cashBackBalance

                            }),
                            instanceName = inputData.accountId + 'cashBack';

                        this.register.components(this, [{
                            name: instanceName,
                            model: dataModel,
                            spec: this.mortgageCashBackSummarySpec,
                            methods: this.mortgageCashBackSummaryComponent
                        }]);

                        if (detailData.rewardInfo.status === 'ENROLLED') {
                            this.components[instanceName].output.emit('state', {
                                target: this,
                                value: 'cashHideBack'
                            });
                        } else {
                            this.components[instanceName].output.emit('state', {
                                target: this,
                                value: 'cashHide'
                            });
                        }

                        componentCollection.push([this.components[instanceName], this.mortgageCashBackSummaryView, {
                            'append': true,
                            'react': true,
                            'target': '#containerContent'

                        }]);

                    }
                }

                //Payment Analysis
                var paymentAnalysisDataModel = observable.Model({
                    paymentAnalysisYear: detailData.paymentAnalysisYear,
                    interestPaidInYear: detailData.detail.interestPaidYTDAmount,
                    principalPaidInYear: detailData.detail.principalPaidYTDAmount,
                    taxesPaidInYear: detailData.detail.taxPaidYTDAmount

                });

                this.register.components(this, [{
                    name: 'PaymentAnalysis',
                    model: paymentAnalysisDataModel,
                    spec: this.mortgagePaymentAnalysisSpec,
                    methods: this.mortgagePaymentAnalysisComponent
                }]);

                dynamicContentUtil.dynamicContent.set(this.components.PaymentAnalysis, 'payment_analysis_year_header', {
                    paymentAnalysisYear: detailData.paymentAnalysisYear
                });

                dynamicContentUtil.dynamicContent.set(this.components.PaymentAnalysis, 'payment_analysis_year_label', {
                    paymentAnalysisYear: detailData.paymentAnalysisYear
                });

                dynamicContentUtil.dynamicContent.set(this.components.PaymentAnalysis, 'principal_paid_in_year_label', {
                    paymentAnalysisYear: detailData.paymentAnalysisYear
                });

                dynamicContentUtil.dynamicContent.set(this.components.PaymentAnalysis, 'taxes_paid_in_year_label', {
                    paymentAnalysisYear: detailData.paymentAnalysisYear
                });

                componentCollection.push([this.components.PaymentAnalysis, this.mortgagePaymentAnalysisView, {
                    'append': true,
                    'react': true,
                    'target': '#containerContent'
                }]);

                controllerChannel.emit('setProfileHeader', {
                    headerLabel: ' '
                });

                this.executeCAV(componentCollection);

            }.bind(this));

        };
    };
});
