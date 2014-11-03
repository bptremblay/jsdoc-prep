define(function(require) {

	return function(settings) {

		var defaultLang = 'en-us',
			language = settings !== undefined ? settings.get('language') : defaultLang;

		var	accountsMessageMap = {
				'en-us': {
					'0': 'System not available. Please try again later.',
					'302': 'Unauthorized',
					'400': 'Unauthorized',
					'401': 'Unauthorized',
					'504': 'We\'re unable to process your request. Please call Customer Service at 1-800-848-9136',
					'CHECKING': 'CHK',
					'ASSET_MANAGEMENT': 'AMA',
					'SAVINGS': 'SAV',
					'MONEY_MARKET': 'MMA',
					'PREPAID': 'PPA',
					'PREPAID_LITE': 'PPX',
					'CERTIFICATE_OF_DEPOSIT': 'CDA',
					'INDIVIDUAL_RETIREMENT_ARRANGMENT': 'IRA',
					'HOME_MORTGAGE': 'HMG',
					'AUTO_LEASE': 'ALS',
					'AUTO_LOAN': 'ALA',
					'HOME_EQUITY_LOAN': 'HEO',
					'HOME_EQUITY_LINE': 'HEL',
					'REVOLVING_CREDIT': 'RCA',
					'INSTALLMENT_LOAN': 'ILA',
					'BUSINESS_REVOLVING_CREDIT': 'BRC',
					'PRIVATE_LABEL_CONSUMER': 'PAC',
					'CONSUMER_CREDIT_CARD': 'BAC',
					'OVERDRAFT_LINE_OF_CREDIT': 'OLC',
					'BUSINESS_CREDIT_CARD': 'BCC',
					'SPEND_FOCUS_CARD': 'SCC',
					'BROKERAGE': 'BRK',
					'JPMORGAN_FUND': 'JPF',
					'ANNUITY': 'ANU',
					'BROKERAGE2': 'BR2',
					'MANAGED': 'WR2',
					'PRIVILEGES': {
						'activityList': 'accountactivity.list',
						'detailList': 'accountdetail.list'
					},

					'ACCOUNT_ACTIVITY_NOT_AVAILABLE_MESSAGE': 'Account Activity cannot be retrieved at this time',
					'NO_INFORMATION_MESSAGE': 'Information not available',
					'NO_TRANSACTION_SINCE_MESSAGE': 'No transactions available since last statement',
					'END_RECORD_MESSAGE': 'End of available records.',
					// 'CARD_PRIVACY_NOTE': '† Credit Card "Current balance" may not reflect all transactions- including most recent transactions, pending authorizations, or interest which may have accumulated since your last statement date. The "Available credit" is the amount of your Credit Access Line/Credit Limit that is currently available for use. Your "Total credit limit" is the total amount of your Credit Access Line/Credit Limit as defined within your Cardmember Agreement. All APRs, including balance transfer APRs, may not be displayed. Please refer to your statement for additional APR information.',
					'CARD_PRIVACY_NOTE': '',
					'SET_REFRESH_DATA_COUNT': 6,
					'NOT_AVAILABLE': 'canceled.',
					'POPUP_WIDTH': {
						'MORTGAGE': '740px',
						'ATM_PREFERENCES': '575px',
						'MESSAGE_CENTER': '673px'
					}
				},
				'sp-es': {
					'0': 'System not available. Please try again later.',
					'302': 'Unauthorized',
					'CHECKING': 'CHK',
					'ASSET_MANAGEMENT': 'AMA',
					'SAVINGS': 'SAV',
					'MONEY_MARKET': 'MMA',
					'PREPAID': 'PPA',
					'PREPAID_LITE': 'PPX',
					'CERTIFICATE_OF_DEPOSIT': 'CDA',
					'INDIVIDUAL_RETIREMENT_ARRANGMENT': 'IRA',
					'HOME_MORTGAGE': 'HMG',
					'AUTO_LEASE': 'ALS',
					'AUTO_LOAN': 'ALA',
					'HOME_EQUITY_LOAN': 'HEO',
					'HOME_EQUITY_LINE': 'HEL',
					'REVOLVING_CREDIT': 'RCA',
					'INSTALLMENT_LOAN': 'ILA',
					'BUSINESS_REVOLVING_CREDIT': 'BRC',
					'PRIVATE_LABEL_CONSUMER': 'PAC',
					'CONSUMER_CREDIT_CARD': 'BAC',
					'OVERDRAFT_LINE_OF_CREDIT': 'OLC',
					'BUSINESS_CREDIT_CARD': 'BCC',
					'SPEND_FOCUS_CARD': 'SCC',
					'BROKERAGE': 'BRK',
					'JPMORGAN_FUND': 'JPF',
					'ANNUITY': 'ANU',
					'BROKERAGE2': 'BR2',
					'MANAGED': 'WR2',
					'PRIVILEGES': {
						'activityList': 'accountactivity.list',
						'detailList': 'accountdetail.list'
					},
					'ACCOUNT_ACTIVITY_NOT_AVAILABLE_MESSAGE': 'Account Activity cannot be retrieved at this time',
					'NO_INFORMATION_MESSAGE': 'Information not available',
					'NO_TRANSACTION_SINCE_MESSAGE': 'No transactions available since last statement',
					'END_RECORD_MESSAGE': 'End of available records.',
					// 'CARD_PRIVACY_NOTE': '† Credit Card "Current balance" may not reflect all transactions- including most recent transactions, pending authorizations, or interest which may have accumulated since your last statement date. The "Available credit" is the amount of your Credit Access Line/Credit Limit that is currently available for use. Your "Total credit limit" is the total amount of your Credit Access Line/Credit Limit as defined within your Cardmember Agreement. All APRs, including balance transfer APRs, may not be displayed. Please refer to your statement for additional APR information.',
					'CARD_PRIVACY_NOTE': '',
					'SET_REFRESH_DATA_COUNT': 6,
					'POPUP_WIDTH': {
						'MORTGAGE': '740px',
						'ATM_PREFERENCES': '575px',
						'MESSAGE_CENTER': '673px'
					}
				},
				'es-mx': {
					'0': 'System not available. Please try again later.'
				}
			},
			fontSizeMap = {
				'fontSizeMax': 22,
				'fontSizeMin': 12,
				'fontSizeInc': 2
			};

		return {
			getAccountsMessage: function(name, lang) {
				lang = language || defaultLang;
				if (lang && name && accountsMessageMap[lang][name]) {
					return accountsMessageMap[lang][name];
				} else if (lang && name === 0 && accountsMessageMap[lang][name]) {
					return accountsMessageMap[lang][name];
				}
				return '';
			}
		};
	};
});
