define(function() {
	var defaultLang = 'en-us',
		storedLanguage = JSON.parse(localStorage.getItem('store~permStore~language')),
		language = storedLanguage !== null ? storedLanguage : defaultLang;

	var localeMessageMap = {
            'en-us': {
                'LOGO': {
                    'CWM': 'https://dgt01q02ea1l001.svr.us.jpmchase.net/content/dam/chase/UltimateRewards/POC/jpm_logo_300%20%28PAF%29.gif',
                    'CONSUMER': 'https://dgt01q02ea1l001.svr.us.jpmchase.net/content/dam/chase/UltimateRewards/POC/chase_logo_300.gif'
                },
                'MONTH': {
                    '01': 'Jan',
                    '02': 'Feb',
                    '03': 'Mar',
                    '04': 'Apr',
                    '05': 'May',
                    '06': 'Jun',
                    '07': 'Jul',
                    '08': 'Aug',
                    '09': 'Sep',
                    '10': 'Oct',
                    '11': 'Nov',
                    '12': 'Dec'
                },
                'menuLablel': {
                    'DOCUMENTS': 'DOCUMENTS',
                    'CONTACT_DETAILS': 'CONTACT DETAILS',
                    'DEMOS': 'DEMOS',
                    'LEGAL_DETAILS': 'LEGAL DETAILS',
                    'ATM_PREFERENCES': 'ATM PREFERENCES',
                    'MESSAGE_CENTER': 'MESSAGE CENTER',
                    'CONTACT_US': 'CONTACT US'
                },
                'TRANSACTION_TYPE': {
                    'A': 'Authorization',
                    'B': 'Adjustment',
                    'C': 'Charge',
                    'D': 'Charge Off',
                    'E': 'Cash Advance',
                    'F': 'Fee',
                    'G': 'Refund',
                    'H': 'Reversal',
                    'O': 'Other',
                    'P': 'Payment',
                    'R': 'Return',
                    'S': 'Sale',
                    'null': 'Pending',
                    'ACH_DEBIT': 'ACH Debit',
                    'ACH_CREDIT': 'ACH Credit',
                    'ACH_PAYMENT': 'ACH Payment',
                    'ACCT_XFER': 'Account Transfer',
                    'ADJUSTMT_REVERSAL': 'Adjustment/Reversal',
                    'ALL': 'All Transactions',
                    'ATM': 'ATM Transaction',
                    'ATM_DEPOSIT': 'ATM Deposit',
                    'BASIC_PAYROLL': 'Basic Payroll',
                    'BILLPAY': 'Bill Payment',
                    'CHASE_TO_PARTNERFI': 'Chase to Partnerfi',
                    'CHECK_DEPOSIT': 'Check Deposit',
                    'CHECK_RETURN': 'Returned Check',
                    'CHECK_PAID': 'Check',
                    'CHECK_PAID_CDA': 'Check Paid CDA',
                    'CHECK_WITHDRAW': 'Check',
                    'CREDIT': 'All Credit',
                    'DEBIT_CARD': 'Debit Card Transaction',
                    'DEBIT': 'All Debit',
                    'DEBIT_REVERSAL': 'Debit Reversal',
                    'DEPOSIT': 'Deposit',
                    'DEPOSIT_RETURN': 'Returned Deposit Item',
                    'FEE_TRANSACTION': 'Fee',
                    'LOAN_PMT': 'Loan Payment',
                    'MISC_DEBIT': 'Misc. Debit',
                    'MISC_CREDIT': 'Misc. Credit',
                    'NSF_DEBIT': 'NSF. Debit',
                    'OVERNIGHT_CHECK': 'Overnight Check',
                    'PARTNERFI_TO_CHASE': 'Partner to Chase',
                    'PREMIUM_PAYROLL': 'Premium Payroll',
                    'QUICK_DEPOSIT': 'Quick Deposit',
                    'QUICKPAY_CREDIT': 'Chase QuickPay Credit',
                    'QUICKPAY_DEBIT': 'Chase QuickPay Debit',
                    'REFUND_TRANSACTION': 'Refund',
                    'TAX_PAYMENT': 'Tax Payment',
                    'WIRE_ONLINE': 'Online Wire Transfer',
                    'WIRE_OUTGOING': 'Outgoing Wire Transfer',
                    'WIRE_INCOMING': 'Incoming Wire Transfer',
                    'SINCE_LAST_STATEMENT': 'Since last statement',
                    'LAST_STATEMENT': 'Last statement',
                    'TWO_STATEMENTS_PRIOR': 'Two statements prior',
                    'THREE_STATEMENTS_PRIOR': 'Three statements prior'
                }
            },
            'sp-es': {
                'LOGO': {
                    'CWM': 'https://dgt01q02ea1l001.svr.us.jpmchase.net/content/dam/chase/UltimateRewards/POC/jpm_logo_300%20%28PAF%29.gif',
                    'CONSUMER': 'https://dgt01q02ea1l001.svr.us.jpmchase.net/content/dam/chase/UltimateRewards/POC/chase_logo_300.gif'
                },
                'MONTH': {
                    '01': 'Jan',
                    '02': 'Feb',
                    '03': 'Mar',
                    '04': 'Apr',
                    '05': 'May',
                    '06': 'Jun',
                    '07': 'Jul',
                    '08': 'Aug',
                    '09': 'Sep',
                    '10': 'Oct',
                    '11': 'Nov',
                    '12': 'Dec'
                },
                'menuLablel': {
                    'DOCUMENTS': 'DOCUMENTOS',
                    'CONTACT_DETAILS': 'DATOS DE CONTACTO',
                    'DEMOS': 'DEMOS',
                    'LEGAL_DETAILS': 'DATOS LEGALES',
                    'ATM_PREFERENCES': 'PREFERENCIAS ATM',
                    'MESSAGE_CENTER': 'CENTRO DE MENSAJES',
                    'CONTACT_US': 'CONTACTO EE.UU.'
                },
                'TRANSACTION_TYPE': {
                    'A': 'es Authorization',
                    'B': 'es Adjustment',
                    'C': 'es Charge',
                    'D': 'es Charge Off',
                    'E': 'es Cash Advance',
                    'F': 'es Fee',
                    'G': 'es Refund',
                    'H': 'es Reversal',
                    'O': 'es Other',
                    'P': 'es Payment',
                    'R': 'es Return',
                    'S': 'es Sale',
                    'null': 'es Pending',
                    'ACH_DEBIT': 'es ACH Debit',
                    'ACH_CREDIT': 'es ACH Credit',
                    'ACH_PAYMENT': 'es ACH Payment',
                    'ACCT_XFER': 'es Account Transfer',
                    'ADJUSTMT_REVERSAL': 'es Adjustment/Reversal',
                    'ALL': 'es All Transactions',
                    'ATM': 'es ATM Transaction',
                    'ATM_DEPOSIT': 'es ATM Deposit',
                    'BASIC_PAYROLL': 'es Basic Payroll',
                    'BILLPAY': 'es Bill Payment',
                    'CHASE_TO_PARTNERFI': 'es Chase to Partnerfi',
                    'CHECK_DEPOSIT': 'es Check Deposit',
                    'CHECK_RETURN': 'es Returned Check',
                    'CHECK_PAID': 'es Check',
                    'CHECK_PAID_CDA': 'es Check Paid CDA',
                    'CHECK_WITHDRAW': 'es Check',
                    'CREDIT': 'es All Credits',
                    'DEBIT_CARD': 'es Debit Card Transaction',
                    'DEBIT': 'es All Debits',
                    'DEBIT_REVERSAL': 'es Debit Reversal',
                    'DEPOSIT': 'es Deposit',
                    'DEPOSIT_RETURN': 'es Returned Deposit Item',
                    'FEE_TRANSACTION': 'es Fee',
                    'LOAN_PMT': 'es Loan Payment',
                    'MISC_DEBIT': 'es Misc. Debit',
                    'MISC_CREDIT': 'es Misc. Credit',
                    'NSF_DEBIT': 'es NSF. Debit',
                    'OVERNIGHT_CHECK': 'es Overnight Check',
                    'PARTNERFI_TO_CHASE': 'es Partner to Chase',
                    'PREMIUM_PAYROLL': 'es Premium Payroll',
                    'QUICK_DEPOSIT': 'es Quick Deposit',
                    'QUICKPAY_CREDIT': 'es Chase QuickPay Credit',
                    'QUICKPAY_DEBIT': 'es Chase QuickPay Debit',
                    'REFUND_TRANSACTION': 'es Refund',
                    'TAX_PAYMENT': 'es Tax Payment',
                    'WIRE_ONLINE': 'es Online Wire Transfer',
                    'WIRE_OUTGOING': 'es Outgoing Wire Transfer',
                    'WIRE_INCOMING': 'es Incoming Wire Transfer',
                    'LAST_STATEMENT': 'es Last statement',
                    'TWO_STATEMENTS_PRIOR': 'es Two statements prior',
                    'THREE_STATEMENTS_PRIOR': 'es Three statements prior'
                }
            }
        };

	return {
		getLocaleMessage: function(name, lang) {
			lang = language || defaultLang;
			if (lang && name && localeMessageMap[lang][name]) {
				return localeMessageMap[lang][name];
			} else if (lang && name === 0 && localeMessageMap[lang][name]) {
				return localeMessageMap[lang][name];
			}
			return '';
		}
	};
});
