 define(function(require) {
     var menuTrans = require('dashboard/service/languageMapper').getLocaleMessage('menuLablel');
     var paymentsUrl = 'https://paymentsq8.chase.com';
     return {
         'profileUrl': '/dashboard/profile/index',
         'logonUrl': 'logon',
         'dashboardUrl': '/dashboard',
         'logOutUrl': '/logon/auth/logout',
         'linkToUrl': 'https://jpmorganq8.chase.com/secure/Positions?AI=',
         'smartAdminStyle1': envConfig.ASSETS_INDEX + 'css/smartadmin-production_unminified.css',
         'smartAdminStyle2': envConfig.ASSETS_INDEX + 'css/smartadmin-skins.css',
         'summaryActivityUrlPrefix': 'dashboard/accounts/summary/activity',
         'summaryFallbackUrlPrefix': 'dashboard/accounts/summary/activity',
         'classicAtmPrefUrl': '#/dashboard/classic/index/atmpreferences',
         'classicMsgCenterUrl': '#/dashboard/classic/index/messagecenter',
         'classicInvestmentUrl': '#/dashboard/classicInvestments/index/investments/',
         'classicMortgageUrl': '#/dashboard/classic/index/mortgage/',
         'convoDeckGreetingDisplayTimer': 3000,
         'convoDeckHeaderNoMessagesTimer': 3000,
         'convoDeckInitMessagesDisplayCount': 1,
         'convoDeckAdMessagesEnabled': true,
         'convoDeckAdMessagesTypeName': 'seurat_dshbrd',
         'convoDeckAdMessagesOrgId': '15629',
         'convoDeckAdMessagesEci': '0318732008',
         'convoDeckSiteMessageModel': {
         	site_message_description: '<p><strong>Here’s what you need to know:</strong></p><p>We’ll contact you by mail and e-mail right away if we believe your account has been compromised by the breach.</p><p>If your card is at risk, don’t worry. All your Chase cards have our Zero Liability Protection; you’re not responsible for paying any unauthorized transactions you report to us.</p><p>We use sophisticated fraud-monitoring tools to review account transactions and spot unusual spending and ATM patterns. This helps us stop fraudulent transactions.</p><p>&nbsp;</p><p><strong>Here’s what we’re doing:</strong></p><p>Defending against fraud is a top priority for us, so we’re taking additional precautions to help keep Chase accounts safe.</p><p>If your Chase debit or Liquid cards are at risk, we’ll temporarily reduce your limits on ATM cash withdrawals and purchases until we can replace your card.</p><p>If you need cash beyond these limits please visit a branch. With proper identification, you can access your available funds.</p><p>Chase credit card customers can continue to use their cards normally. These temporary debit and Chase Liquid card changes do not apply to the credit cards used at Target during the affected period.</p><p>&nbsp;</p><p><strong>Here’s what to do if we’ve told you your debit or Liquid card accounts are at risk:</strong></p><p>Employees at our 5,600 branches are standing by to help you if you need more cash than $250. With proper identification, you can access all your avail- able funds. Roughly half of our branches can issue you a new debit card on the spot. The new debit card won’t have the reduced limits described above.</p><p>To find a branch near you, visit our branch locator on chase.com. Branch locator also includes specific hours for each location, and information about which branches have instant issue capability – allowing you to replace your debit card and get a new pin in the branch.</p><p>Monitor your account using chase.com or Chase Mobile – for transactions you don’t recognize and contact us immediately for assistance.</p>',
         	site_message_brief: '<p><strong>Target is the victim of a massive breach...</strong></p><p>If you used your Chase debit, Liquid or credit cards at a Target store between Nov. 27-Dec. 15, your accounts may be at risk.</p>',
         	site_message_action_text: '<p><a class="site-message-expand">Tell me more about the outage.&nbsp;&nbsp;&nbsp;&nbsp; &gt;</a><a class="site-message-collapse" style="display:none;">&lt;&nbsp;&nbsp; Back</a></p>'
         },
         'POPUP_URL': {
             'ATM_PREFERENCES': 'https://bankingq8.chase.com/ATMPreference/RoutePage.aspx?Chase3FramedPage=true',
             'MESSAGE_CENTER': 'https://messagecenterq8.chase.com/smcPortal/web/user/session/SSOLogin.jsp',
             'MORTGAGE': 'https://servicingq8.chase.com/homefinance/MortgagePayoffQuote/Information?Chase3FramedPage=true&AI='
         },
         'IFRAME_URL': {
             'atmpreferences': {
             	pageTitle: 'Chase ATM QuickChoice<sup>SM</sup> Preferences',
             	iframeTitle: 'Chase ATM QuickChoice Preferences',
             	url: 'https://bankingq8.chase.com/ATMPreference/RoutePage.aspx'
             },
             'messagecenter': {
             	pageTitle: 'Secure Message Center',
             	iframeTitle: 'Secure Message Center',
             	url: 'https://messagecenterq8.chase.com/smcPortal/web/user/session/SSOLogin.jsp'
             },
             'mortgage': {
             	pageTitle: 'Mortgage Payoff Quote',
             	iframeTitle: 'Mortgage Payoff Quote',
             	url: 'https://servicingq8.chase.com/homefinance/MortgagePayoffQuote/Information'
             },
             'homeorderchecks': {
             	pageTitle: 'Order Checks',
             	iframeTitle: 'Order Checks',
             	url: 'https://servicingq8.chase.com/homefinance/OrderChecks/Request'
             },
             'changecarddesign': {
             	pageTitle: 'Choose Card Design',
             	iframeTitle: 'Choose Card Design',
             	url: 'https://cardsq8.chase.com/CustService/ChangeCardDesign.aspx'
             },
             'cardmemberagreement': {
             	pageTitle: 'Request Cardmember Agreement',
             	iframeTitle: 'Request Cardmember Agreement',
             	url: 'https://cardsq8.chase.com/CMA/CmaRequest.aspx'
             },
             'requestcopyofinvoice': {
             	pageTitle: 'Request Invoice',
             	iframeTitle: 'Request Invoice',
             	url: 'https://servicingq8.chase.com/autofinance/RequestInvoice/Request'
             },
             'borrowerportal': {
             	pageTitle: 'Loan Modification Center',
             	iframeTitle: 'Loan Modification Center',
             	url: 'https://applyq8.chase.com/BorrowerPortal/MortgageModification/Home'
             },
             'autopaymentsent': {
             	pageTitle: 'Payment Information',
             	iframeTitle: 'Payment Information',
             	url: 'https://servicingq8.chase.com/caf/secured/PaymentArrangement/PaymentArrangement.aspx'
             },
             'depositdisclosures': {
             	pageTitle: 'Deposit Disclosures and Interest Rates',
             	iframeTitle: 'Deposit Disclosures and Interest Rates',
             	url: 'https://applyq8.chase.com/secured/oao/disclosuresrouter.aspx'
             },
             'investments': {
             	pageTitle: '',
             	iframeTitle: 'Investments',
             	url: 'https://jpmorganq8.chase.com/secure/Positions'
             },
             'investmenttab': {
             	pageTitle: '',
             	iframeTitle: 'Investments',
             	url: 'https://investmentsq8.chase.com/ResearchAndMarketData/Index?'
             },
             'investmentsportfoliopositions': {
             	pageTitle: '',
             	iframeTitle: 'Investments',
             	url: 'https://jpmorganq8.chase.com/secure/Positions'
             },
             'investmentsportfolioassetclass': {
             	pageTitle: '',
             	iframeTitle: 'Investments',
             	url: 'https://jpmorganq8.chase.com/secure/Positions?TabName=AssetTab'
             },
             'investmentsportfoliooverview': {
             	pageTitle: '',
             	iframeTitle: 'Investments',
             	url: 'https://jpmorganq8.chase.com/secure/Positions?TabName=Charts'
             },
             'investmentsportfoliobalances': {
             	pageTitle: '',
             	iframeTitle: 'Investments',
             	url: 'https://jpmorganq8.chase.com/secure/Balances'
             },
             'investmentsportfoliotransactions': {
             	pageTitle: '',
             	iframeTitle: 'Investments',
             	url: 'https://jpmorganq8.chase.com/secure/Transactions'
             },
             'investmentsportfoliorealizedgainloss': {
             	pageTitle: '',
             	iframeTitle: 'Investments',
             	url: 'https://jpmorganq8.chase.com/secure/RealizedGainLoss'
             },
             'investmentsourexpertise': {
             	pageTitle: '',
             	iframeTitle: 'Investments',
             	url: 'https://investmentsq8.chase.com/Investing/AboutInvesting'
             },
             'investmentsretirement': {
             	pageTitle: '',
             	iframeTitle: 'Investments',
             	url: 'https://investmentsq8.chase.com/Investing/PlanningRetirement'
             },
             'invforms': {
             	pageTitle: '',
             	iframeTitle: 'Investments',
             	url: 'https://investmentsq8.chase.com/Static/FormsDisclosuresAccountSelect'
             },
             'invformscisc': {
             	pageTitle: '',
             	iframeTitle: 'Investments',
             	url: 'https://investmentsq8.chase.com/Static/FormsDisclosures?accountGroup=CISC'
             },
             'invformssda': {
             	pageTitle: '',
             	iframeTitle: 'Investments',
             	url: 'https://investmentsq8.chase.com/Static/FormsDisclosures?accountGroup=SDA'
             },
             'invformsjpms': {
             	pageTitle: '',
             	iframeTitle: 'Investments',
             	url: 'https://investmentsq8.chase.com/Static/FormsDisclosures?accountGroup=JPMS'
             },
             'mortgageescrowsummary': {
                pageTitle: 'Mortgage Escrow Information',
                iframeTitle: 'Mortgage Escrow Information',
                url: 'https://servicingq8.chase.com/homefinance/MortgageEscrowSummary/Information'
             },
             'mortgageescrowtaxinsurance': {
                pageTitle: 'Escrow, Property Tax and Insurance Details',
                iframeTitle: 'Escrow, Property Tax and Insurance Details',
                url: 'https://servicingq8.chase.com/homefinance/MortgageEscrowTaxInsurance/PropertyTaxIndex'
             },
             'mortgageescrowanalysis': {
                pageTitle: 'Escrow Analysis and Statement',
                iframeTitle: 'Escrow Analysis and Statement',
                url: 'https://servicingq8.chase.com/homefinance/MortgageEscrowAnalysis/Summary'
             },
             'wireactivation': {
             	pageTitle: 'Wire Transfers Activation',
             	iframeTitle: 'Wire Transfers Activation',
             	url: 'https://chaseonlineq8.chase.com/Secure/ServiceActivation/LOBServiceController.aspx?_context=wire'
             },
             'wireaddrecipient': {
             	pageTitle: 'Add Wire Recipient',
             	iframeTitle: 'Add Wire Recipient',
             	url: 'https://paymentsq8.chase.com/Wire/WireRecipientAddForm1.aspx'
             },
             'wireactivity': {
                pageTitle: 'Wire Activity',
                iframeTitle: 'Wire Activity',
                url: paymentsUrl + '/Wire/WireActivity.aspx'
             },
             'schedulewire': {
                pageTitle: 'Wire Money',
                iframeTitle: 'Wire Money',
                url: paymentsUrl + '/Wire/WireAddForm1.aspx?IsOneTimePayment=true'
             },
             'repeatingwire': {
                pageTitle: 'Wire Money',
                iframeTitle: 'Wire Money',
                url: paymentsUrl + '/Wire/WireAddForm1.aspx?IsOneTimePayment=false'
             },
             'addcreditcardauthorizeduser': {
                pageTitle: 'Add Authorized User',
                iframeTitle: 'Add Authorized User',
                url: 'https://cardsq8.chase.com/CustService/AddAuthorizedUser.aspx'
             },
             'autofuturepayment': {
             	pageTitle: 'Payment Information',
             	iframeTitle: 'Payment Information',
             	url: 'https://servicingq8.chase.com/caf/secured/PromiseToPay/PromiseToPayPaymentInformation.aspx'
             },
             'blueprint': {
             	pageTitle: '',
             	iframeTitle: 'Blueprint - Homepage',
             	url: 'https://cardsq8.chase.com/cc/BluePrint/Home/Index'
             },
             'blueprintfinish': {
             	pageTitle: '',
             	iframeTitle: 'Blueprint - Finish It',
             	url: 'https://cardsq8.chase.com/cc/BluePrint/FinishIt/Index'
             },
             'blueprintfullpay': {
             	pageTitle: '',
             	iframeTitle: 'Blueprint - Full Pay',
             	url: 'https://cardsq8.chase.com/cc/BluePrint/FullPay/Index'
             },
             'blueprintsplitit': {
             	pageTitle: '',
             	iframeTitle: 'Blueprint - Split It',
             	url: 'https://cardsq8.chase.com/cc/BluePrint/SplitIt/Index'
             },
             'blueprinttrackit': {
             	pageTitle: '',
             	iframeTitle: 'Blueprint - Track It',
             	url: 'https://cardsq8.chase.com/cc/BluePrint/TrackIt/Index'
             },
             'blueprintsetbudgets': {
             	pageTitle: '',
             	iframeTitle: 'Blueprint - Set Budgets',
             	url: 'https://cardsq8.chase.com/cc/BluePrint/TrackIt/SetBudgets'
             },
              'setreportingtimeframe': {
             	pageTitle: 'Set Reporting Timeframe',
             	iframeTitle: 'Set Reporting Timeframe',
             	url: 'https://chaseonlineq8.chase.com/secure/profile/ReportingTimeFrame/AddUpdate.aspx'
             },
             'costbasisinformation': {
                pageTitle: 'Update Cost Basis',
                iframeTitle: 'Update Cost Basis',
                url: 'https://investmentsq8.chase.com/UpdateCostBasis/CostBasisInformation'
             },
             'loanassumption': {
                pageTitle: 'Loan Assumption',
                iframeTitle: 'Loan Assumption',
                url: 'https://servicingq8.chase.com/homefinance/LoanAssumption/Information'
			 },
             'mycustomgroups': {
                pageTitle: 'My Custom Groups',
                iframeTitle: 'My Custom Groups',
                url: 'https://jpmorganq8.chase.com/Secure/CustomGroups'
             },
             'transferbrokeragefunds': {
                pageTitle: 'Transfer Brokerage Funds',
                iframeTitle: 'Transfer Brokerage Funds',
                url: paymentsUrl + '/PNT/Investments/BrokerageTransfer/Entry'
             },
             'establishfundstransfer': {
                pageTitle: 'Establish Brokerage Funds',
                iframeTitle: 'Establish Brokerage Funds',
                url: 'https://investmentsq8.chase.com/EstablishFundsTransfer/AccountInformation'
             },
             'autopayoffquote': {
                pageTitle: 'Payoff Quotes',
                iframeTitle: 'Payoff Quotes',
                url: 'https://servicingq8.chase.com/autofinance/PayoffQuote/PayoffQuotes'
             }
         },
         'megaMenuInstance': {
             logoUrl: null,
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
                 linkTo: 'https://chaseonlineq8.chase.com/secure/CustomerCenter.aspx',
                 target: true
             }]
         },
         'topMenuInstance': {
             navigation: [{
                 label: 'Everyday',
                 active: true,
                 linkTo: '#dashboard',
                 target: 'self',
                 next: true

             }, {
                 label: 'Investments',
                 active: false,
                 linkTo: '#/dashboard/classicInvestments/index/investments',
                 target: 'self',
                 next: false
             }]
         },
         'paymentMenuInstance': {
             status: true,
             showBlock: true,
             focused: false,
             paymentMenuOptions: {
                 'payBills': {
                     'label': 'Pay Bills',
                     'active': false,
                     'show': true,
                     'id': 'payBills',
                     'semanticTag': 'pay_bills',
                     'action': 'enablePayBill',
                     'link': '/dashboard/payBill',
                     'showLink': true
                 },
                 'sendMoney': {
                     'label': 'Person-to-Person',
                     'active': false,
                     'show': true,
                     'id': 'sendMoney',
                     'semanticTag': 'send_money',
                     'action': 'sendMoney',
                     'link': '/dashboard/qp',
                     'showLink': true
                 },
                 'transferMoney': {
                     'label': 'Transfer Funds',
                     'active': false,
                     'show': false,
                     'id': 'transferMoney',
                     'semanticTag': 'transfer_money',
                     'action': 'transferMoney',
                     'link': '/dashboard/payments/index/transferMoney',
                     'showLink': false
                 },
                 'paymentsActivity': {
                     'label': 'Payment Activity',
                     'active': false,
                     'show': false,
                     'id': 'requestPaymentActivity',
                     'semanticTag': 'request_payment_activity',
                     'action': 'paymentsActivity',
                     'link': '/dashboard/paymentsActivity',
                     'showLink': true
                 },
                 'More': {
                     'label': 'More',
                     'id': 'paymentMenuAdditionalOptions',
                     'semanticTag': 'payment_menu_additional_options',
                     'active': false,
                     'show': false,
                     'showLink': true,
                     'link': '/dashboard',
                     'submenu': [
                     		{
	                     	'label': 'Manage pay from account',
		                     'active': false,
		                     'show': false,
		                     'id': 'manageFundingAccounts',
		                     'semanticTag': 'manage_funding_accounts',
		                     'action': 'manageFundingAccounts',
		                     'link': '/dashboard/manageFundingAccounts',
		                     'showLink': true
                     }
                     ]
                 }
             },
             associations: [{
         		name: 'payments.paybills',
         		association: 'payBills'
         	},
         	{
         		name: 'payments.activity',
         		association: 'requestPaymentActivity'
         	},
         	{
         		name: 'payments.payees.add',
         		association: 'addFundingAccounts'
         	},
         	{
         		name: 'payments.payees.manage',
         		association: 'manageFundingAccounts'
         	}],
         	labelSuffixes: [
         		{
         			suffix: 'Navigation'
         		},
         		{
         			suffix: 'Header'
         		},
         		{
         			suffix: 'Label'
         		}
         	]
         },
         'summaryInstance': {
             summaryData: {}
         },
         'detailsInstance': {
             detailsData: null
         },
         'accountActivityInstance': {
             activityData: null
         },
         'atmPreferences': {
             preferencesURL: ''
         },
         'MortgagePayoff': {
             mortgageUrl: ''
         },
         'searchInstance': {
             searchText: 'This is more than just an ordinary search bar.',
             showOptions: false
         },
         'paybillsInstance': {
             enabled: false,
             paybillCompleted: false
         },
         'paymentCompleteInstance': {
             'enabled': false,
             'date': true,
             'amount': true,
             'to': true,
             'from': true
         },
         'sendMoneyInstance': {
             enabled: false
         },
         'transferMoneyInstance': {
             enabled: false
         },
         'searchActivity': {
             searchText: ''
         },
         'contentSubSection': {
             title: null
         },
         'customerCenter': {
             preferencesUrl: null
         },
         'messageCenter': {
             preferencesUrl: null
         },
         'footerInstance': {
             title: ''
         },
         'primarySearch': {
			'init': '1',
			'featureClass': 'P',
			'style': 'full',
			'maxRows': '12',  //max no of typeahead suggestions
			'faq': '1',
			'type': 'json',
			'api': '1',
			'goBackLinkData': 'Go Back'
         },
         'personlizationData' : {
			'segment': 'POH',
			'pm': 'ATM|CHK|MMA|BAC',
			'AOC': '5286',
			'apc': '141',
			'RPC': 'MP',
			'pfid': '50718871',
		},
         'quickPay': {
			'ACTIVITIES_MEMO_WRAP': 40,
			'ACTIVITIES_NAME_WRAP': 16,
			'NOTIFICATION_PAYMENTS_TO_SHOW': 6,
			'SERVICE_STATUS_ENUM': {
			    'Pending': 'PENDING',
			    'In_Process_2': 'IN_PROCESS',
			    'Funded': 'FUNDED',
			    'Funds_Needed': 'FUNDS_NEEDED',
			    'Funding_Failed': 'FUNDING_FAILED',
			    'Sent': 'SENT',
			    'Paid': 'PAID',
			    'Returned': 'RETURNED',
			    'Reversal_Initiated': 'REVERSAL_INITIATED',
			    'Reversal_Completed': 'REVERSAL_COMPLETED',
			    'Reversal_Failed': 'REVERSAL_FAILED',
			    'Canceled': 'CANCELED',
			    'Suspended': 'SUSPENDED',
			    'Rejected': 'REJECTED',
			    'Pending_Review': 'PENDING_REVIEW',
			    'Completed': 'COMPLETED',
			    'Active': 'ACTIVE',
			    'Pending_Acceptance': 'PENDING_ACCEPTANCE',
			    'Accepted': 'ACCEPTED',
			    'Declined': 'DECLINED',
	         	'ALL':'All'
		  	},
		  	'SERVICE_STATUS_ACCEPT_MONEY': {
			    'DEFAULT': 'DEFAULT',
			    'CANCELD': 'CANCELD',
			    'IN_PROCESS_CHASE_FROM_NON_CHASE': 'IN_PROCESS_CHASE_FROM_NON_CHASE',
			    'IN_PROCESS_CHASE': 'IN_PROCESS_CHASE',
			    'IN_PROCESS_NON_CHASE':'IN_PROCESS_NON_CHASE',
			    'IN_PROCESS_CXE':'IN_PROCESS_CXE'
		  	},
		  	'PENDING_ACTION_TYPE':{
		  		'PAYMENT':'payment',
		  		'REQUEST':'request'
		  	}
         }
     };
 });

