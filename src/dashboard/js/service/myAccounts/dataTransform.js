/**
 * @copyright & copy;
 JPMorgan Chase & Co.All rights reserved.
 * @module DataTransform
 */
//Todo: Functions that may pull in to framework later.
define(function(require) {
	var http = require('blue/http'),
		defaultNull = 'Not available',
		currency = '$';

	return {
		/**
		 * Function for convert a data for accouts summary based on account type
		 * @function accountSummaryData
		 * @param {Object} [data] Account summay data
		 * @function accountBalance will convert account as possitive/negative
		 * @function asOfDateFormat will convert as-of-date format
		 * @memberOf module:dataTransform
		 **/
		accountSummaryData: function(data) {
			var accountsData = this.objectClone(data),
				accData, i;
			for (i in accountsData) {
				if (accountsData.hasOwnProperty(i)) {
					accData = accountsData[i];
					accData.asOf = (this.isDefined(accData.summary) && this.isDefined(accData.summary.asOf)) ? this.asOfDateWithHrs(accData.summary.asOf) : defaultNull;
					accData.lead_value = this.isDefined(accData.summary) ? this.getLeadValue(accData) : defaultNull;
					accData.accountId = accData.accountId.toString();
				}
			}
			return accountsData;
		},

		/**
		 * Function create a model object with the properties in account object
		 * @function accountModelData
		 * @param {Object} [acctModel] contain account object
		 * @memberOf module:dataTransform
		 **/
		accountModelData: function(acctModel) {
			return {
				accountId: acctModel.accountNumber,
				accountType: acctModel.accountType,
				detailType: acctModel.detailType,
				accountName: acctModel.accountName,
				accountMask: acctModel.accountMaskNumber,
				accountClosedInd: (this.isDefined(acctModel.accountClosedInd) && acctModel.accountClosedInd) ? true : false
			};
		},

		/**
		 * Function for converting data for Account Details
		 * @function accountDetails
		 * @param {Object} [detailsData] contain details object
		 * @memberOf module:dataTransform
		 **/
		accountDetails: function(data, accountType) {
			var detailsData = data.detail;
			if (!this.isDefined(detailsData)) {
				detailsData = {}
			}
			//TODO: below commented lines need to be removed once verified with all the account types.
			//detailsData.asOfDate = this.isDefined(detailsData.asOfDate) ? this.asOfDateWithMM(detailsData.asOfDate) : defaultNull;
			//detailsData.nextPaymentDate = this.isDefined(detailsData.nextPaymentDate) ? this.splitMMDDYYYY(detailsData.nextPaymentDate) : defaultNull;
			//detailsData.principalBalance = this.isDefined(detailsData.principalBalance) ? this.currencyFormat(detailsData.principalBalance) : defaultNull;
			//detailsData.paymentDueDate = this.isDefined(detailsData.paymentDueDate) ? this.splitMMDDYYYY(detailsData.paymentDueDate) : defaultNull;
			//detailsData.current = this.isDefined(detailsData.current) ? this.currencyFormat(detailsData.current) : defaultNull;
			//detailsData.showPayOff = (accountType === 'MORTGAGE') ? true : false;
			detailsData.detailType = this.isDefined(detailsData.detailType) ? detailsData.detailType : null;
			detailsData.lastStmtDate = this.isDefined(detailsData.lastStmtDate) ? this.splitMMDDYYYY(detailsData.lastStmtDate) : defaultNull;

			switch (detailsData.detailType) {
				case 'CHK':
				case 'SAV':
				case 'MMA':
				case 'PPX':
				case 'PPA':

					detailsData.available = this.isDefined(detailsData.available) ? this.currencyFormat(detailsData.available) : defaultNull;
					detailsData.interestRate = this.isDefined(detailsData.interestRate) ? detailsData.interestRate + '%' : defaultNull;
					detailsData.presentBalance = this.isDefined(detailsData.presentBalance) ? this.currencyFormat(detailsData.presentBalance) : defaultNull;
					detailsData.ytdInterest = this.isDefined(detailsData.ytdInterest) ? '$' + detailsData.ytdInterest : defaultNull;
					detailsData.lastDepositDate = this.isDefined(detailsData.lastDepositDate) ? this.splitMMDDYYYY(detailsData.lastDepositDate) : defaultNull;
					detailsData.asOf = this.isDefined(detailsData.asOf) ? this.asOfDateWithMM(detailsData.asOf) : defaultNull;
					if (detailsData.overdraftProtectionDetail) {
						detailsData.overdraftProtectionDetail.fundingAccount = this.isDefined(detailsData.overdraftProtectionDetail.fundingAccount) ? detailsData.overdraftProtectionDetail.fundingAccount : defaultNull;
						detailsData.overdraftProtectionDetail.fundingAccountLimit = this.isDefined(detailsData.overdraftProtectionDetail.fundingAccountLimit) ? this.currencyFormat(detailsData.overdraftProtectionDetail.fundingAccountLimit) : defaultNull;
					}
					if(data.privileges) {
						for(var i=0; i<data.privileges.length; i++) {
							if(data.privileges[i].name === 'ddaaccountdetail.debitcardcoverage.enroll') {
								detailsData.debitCardCoverageEnrollmentStatus = false; //Set up
							}
							if(data.privileges[i].name === 'ddaaccountdetail.debitcardcoverage.enrolled') {
								detailsData.debitCardCoverageEnrollmentStatus = true; //On
							}
						}
					}
					break;
				case 'PAC':
				case 'BAC':
				case 'OLC':
					detailsData.cashAPR = this.isDefined(detailsData.cashAPR) ? detailsData.cashAPR + '%' : defaultNull;
					detailsData.blueprintNextPaymentAmount = this.isDefined(detailsData.blueprintNextPaymentAmount) ? this.currencyFormat(detailsData.blueprintNextPaymentAmount) : defaultNull;
					detailsData.currentBalance = this.isDefined(detailsData.currentBalance) ? this.currencyFormat(detailsData.currentBalance) : defaultNull;
					detailsData.lastPaymentDate = this.isDefined(detailsData.lastPaymentDate) ? this.splitMMDDYYYY(detailsData.lastPaymentDate) : defaultNull;
					detailsData.lastPaymentAmount = this.isDefined(detailsData.lastPaymentAmount) ? this.currencyFormat(detailsData.lastPaymentAmount) : defaultNull;
					detailsData.showBluePrint = (this.isDefined(detailsData.blueprintEnrolled) && detailsData.blueprintEnrolled) ? true : false;
					detailsData.purchaseAPR = this.isDefined(detailsData.purchaseAPR) ? detailsData.purchaseAPR + '%' : defaultNull;
					detailsData.nextPaymentDueDate = this.isDefined(detailsData.nextPaymentDueDate) ? this.splitMMDDYYYY(detailsData.nextPaymentDueDate) : defaultNull;
					detailsData.lastStmtBalance = this.isDefined(detailsData.lastStmtBalance) ? this.currencyFormat(detailsData.lastStmtBalance) : defaultNull;
					detailsData.nextPaymentAmount = this.isDefined(detailsData.nextPaymentAmount) ? this.currencyFormat(detailsData.nextPaymentAmount) : defaultNull;
					detailsData.creditLimit = this.isDefined(detailsData.creditLimit) ? this.currencyFormat(detailsData.creditLimit) : defaultNull;
					detailsData.availableCredit = this.isDefined(detailsData.availableCredit) ? this.currencyFormat(detailsData.availableCredit) : defaultNull;
					break;
				case 'CDA':
				case 'IRA':
					detailsData.available = this.isDefined(detailsData.available) ? this.currencyFormat(detailsData.available) : defaultNull;
					detailsData.interestRate = this.isDefined(detailsData.interestRate) ? detailsData.interestRate + '%' : defaultNull;
					detailsData.presentBalance = this.isDefined(detailsData.presentBalance) ? this.currencyFormat(detailsData.presentBalance) : defaultNull;
					detailsData.ytdInterest = this.isDefined(detailsData.ytdInterest) ? '$' + detailsData.ytdInterest : defaultNull;
					detailsData.lastDepositDate = this.isDefined(detailsData.lastDepositDate) ? this.splitMMDDYYYY(detailsData.lastDepositDate) : defaultNull;
					detailsData.asOf = this.isDefined(detailsData.asOf) ? this.asOfDateWithMM(detailsData.asOf) : defaultNull;
					detailsData.maturityDate = this.isDefined(detailsData.maturityDate) && this.isValidDate(detailsData.maturityDate) ? this.splitMMDDYYYY(detailsData.maturityDate) : defaultNull;
					detailsData.issueRenewalDate = this.isDefined(detailsData.issueRenewalDate) && this.isValidDate(detailsData.issueRenewalDate) ? this.splitMMDDYYYY(detailsData.issueRenewalDate) : defaultNull;
					detailsData.annualPercentYield = this.isDefined(detailsData.annualPercentYield) ? detailsData.annualPercentYield + '%' : defaultNull;
					detailsData.interestNotYetPaid = this.isDefined(detailsData.interestNotYetPaid) ? '$' + detailsData.interestNotYetPaid : defaultNull;
					break;
				default:
					detailsData.available = defaultNull;
					detailsData.interestRate = defaultNull;
					detailsData.presentBalance = defaultNull;
					detailsData.ytdInterest = defaultNull;
					detailsData.lastDepositDate = defaultNull;
					detailsData.cashAPR = defaultNull;
					detailsData.blueprintNextPaymentAmount = defaultNull;
					detailsData.currentBalance = defaultNull;
					detailsData.lastPaymentDate = defaultNull;
					detailsData.lastPaymentAmount = defaultNull;
					detailsData.showBluePrint = false;
					detailsData.purchaseAPR = defaultNull;
					detailsData.nextPaymentDueDate = defaultNull;
					detailsData.lastStmtBalance = defaultNull;
					detailsData.nextPaymentAmount = defaultNull;
					detailsData.creditLimit = defaultNull;
					detailsData.availableCredit = defaultNull;
					detailsData.asOf = defaultNull;
					break;
			}
			return detailsData;
		},

		/**
		 * Function for converting data for Mortgage Details
		 * @function loanOriginationDate
		 * @param {Object} [data] contain details object
		 * @memberOf module:dataTransform
		 **/
		mortgageDetailData: function(detailData) {
			if (!this.isDefined(detailData)) {
				detailData = {}
			}
			if (!this.isDefined(detailData.detail)) {
				detailData.detail = {}
			}
			detailData.nickname = this.isDefined(detailData.nickname) ? detailData.nickname : defaultNull;
			detailData.mask = this.isDefined(detailData.mask) ? detailData.mask.toUpperCase().replace('X', '...') : defaultNull;
			detailData.paymentAnalysisYear = this.isDefined(detailData.detail.asOfDate) ? detailData.detail.asOfDate : defaultNull;
			if (detailData.detail) {
				detailData.detail.balance = this.isDefined(detailData.detail.balance) ? this.currencyFormat(detailData.detail.balance) : defaultNull;
				detailData.detail.nextPaymentDate = this.isDefined(detailData.detail.nextPaymentDate) ? this.splitMMDDYYYY(detailData.detail.nextPaymentDate) : defaultNull;
				detailData.detail.nextPaymentAmount = this.isDefined(detailData.detail.nextPaymentAmount) ? this.currencyFormat(detailData.detail.nextPaymentAmount) : defaultNull;
				detailData.detail.lastPaymentDate = this.isDefined(detailData.detail.lastPaymentDate) ? this.splitMMDDYYYY(detailData.detail.lastPaymentDate) : defaultNull;
				detailData.detail.lastPaymentAmount = this.isDefined(detailData.detail.lastPaymentAmount) ? this.currencyFormat(detailData.detail.lastPaymentAmount) : defaultNull;
				detailData.detail.productTypeCode = this.isDefined(detailData.detail.productTypeCode) ? detailData.detail.productTypeCode : defaultNull;
				detailData.detail.productTypeDescription = this.isDefined(detailData.detail.productTypeDescription) ? detailData.detail.productTypeDescription : defaultNull;
				if (!this.isDefined(detailData.detail.autoPayIndicator)) {
					detailData.detail.autoPayIndicator = false;
				}
				detailData.detail.autoPayIndicator = (detailData.detail.autoPayIndicator) ? 'On' : 'Off';
				detailData.detail.nextAutoPaymentDate = this.isDefined(detailData.detail.nextAutoPaymentDate) ? this.splitMMDDYYYY(detailData.detail.nextAutoPaymentDate) : defaultNull;
				detailData.detail.activeMilitaryIndicator = this.isDefined(detailData.detail.activeMilitaryIndicator) ? detailData.detail.activeMilitaryIndicator : false;
				if (!this.isDefined(detailData.detail.paperlessIndicator)) {
					detailData.detail.paperlessIndicator = false;
				}
				detailData.detail.paperlessIndicator = (detailData.detail.paperlessIndicator) ? 'On' : 'Off';
				detailData.detail.totalMonthlyPaymentsTillDate = this.isDefined(detailData.detail.totalMonthlyPaymentsTillDate) ? detailData.detail.totalMonthlyPaymentsTillDate : defaultNull;
				detailData.detail.totalMonthlyPayments = this.isDefined(detailData.detail.totalMonthlyPayments) ? detailData.detail.totalMonthlyPayments : defaultNull;
				detailData.detail.accountPrincipalBalance = this.isDefined(detailData.detail.accountPrincipalBalance) ? detailData.detail.accountPrincipalBalance : defaultNull;
				detailData.detail.originalAppraisalAmount = this.isDefined(detailData.detail.originalAppraisalAmount) ? this.currencyFormat(detailData.detail.originalAppraisalAmount) : defaultNull;
				//loantype
				detailData.detail.interestRate = this.isDefined(detailData.detail.interestRate) ? detailData.detail.interestRate + '%' : defaultNull;
				detailData.detail.interestPaidYTDAmount = this.isDefined(detailData.detail.interestPaidYTDAmount) ? this.currencyFormat(detailData.detail.interestPaidYTDAmount) : defaultNull;
				detailData.detail.armMarginRate = this.isDefined(detailData.detail.armMarginRate) ? detailData.detail.armMarginRate + '%' : defaultNull;
				detailData.detail.armIndexRate = this.isDefined(detailData.detail.armIndexRate) ? detailData.detail.armIndexRate + '%' : defaultNull;
				detailData.detail.armIndexName = this.isDefined(detailData.detail.armIndexName) ? this.getTitleCase(detailData.detail.armIndexName) : defaultNull;
				if (this.isDefined(detailData.detail.armIndexRate) && this.isDefined(detailData.detail.armMarginRate)) {
					detailData.detail.armTotalInterestRate = parseFloat(detailData.detail.armIndexRate) + parseFloat(detailData.detail.armMarginRate) + '%';
				} else {
					detailData.detail.armTotalInterestRate = defaultNull;
				}
				detailData.detail.rateChangeDate = this.isDefined(detailData.detail.rateChangeDate) ? this.splitMMDDYYYY(detailData.detail.rateChangeDate) : defaultNull;
				detailData.detail.paymentChangeDate = this.isDefined(detailData.detail.paymentChangeDate) ? this.splitMMDDYYYY(detailData.detail.paymentChangeDate) : defaultNull;
				detailData.detail.originalLoanDate = this.isDefined(detailData.detail.originalLoanDate) ? this.splitMMDDYYYY(detailData.detail.originalLoanDate) : defaultNull;
				detailData.detail.originalPayoffDate = this.isDefined(detailData.detail.originalPayoffDate) ? this.splitMMDDYYYY(detailData.detail.originalPayoffDate) : defaultNull;
				detailData.detail.originalLoanAmount = this.isDefined(detailData.detail.originalLoanAmount) ? this.currencyFormat(detailData.detail.originalLoanAmount) : defaultNull;
				detailData.detail.numOfPaymentsMade = this.isDefined(detailData.detail.numOfPaymentsMade) ? detailData.detail.numOfPaymentsMade : defaultNull;
				detailData.detail.originalNumOfPayments = this.isDefined(detailData.detail.originalNumOfPayments) ? detailData.detail.originalNumOfPayments : defaultNull;
				detailData.detail.principalPaidYTDAmount = this.isDefined(detailData.detail.principalPaidYTDAmount) ? this.currencyFormat(detailData.detail.principalPaidYTDAmount) : defaultNull;
				detailData.detail.escrowCurrentBalance = this.isDefined(detailData.detail.escrowCurrentBalance) ? this.currencyFormat(detailData.detail.escrowCurrentBalance) : '$0.00';
				detailData.detail.lastEscrowAnalysisDate = this.isDefined(detailData.detail.lastEscrowAnalysisDate) ? this.splitMMDDYYYY(detailData.detail.lastEscrowAnalysisDate) : defaultNull;
				detailData.detail.lateFees = this.isDefined(detailData.detail.lateFees) ? this.currencyFormat(detailData.detail.lateFees) : defaultNull;
				detailData.detail.gracePeriod = this.isDefined(detailData.detail.gracePeriod) ? detailData.detail.gracePeriod : '';
				detailData.detail.taxPaidYTDAmount = this.isDefined(detailData.detail.taxPaidYTDAmount) ? this.currencyFormat(detailData.detail.taxPaidYTDAmount) : defaultNull;
			}
			if (detailData.rewardInfo) {
				detailData.rewardInfo.earnings = this.isDefined(detailData.rewardInfo.earnings) ? this.currencyFormat(detailData.rewardInfo.earnings) : defaultNull;
			}
			if (detailData.propertyAddress) {
				detailData.propertyAddress.addressLine1 = this.isDefined(detailData.propertyAddress.addressLine1) ? this.getTitleCase(detailData.propertyAddress.addressLine1) : defaultNull;
				detailData.propertyAddress.addressLine2 = this.isDefined(detailData.propertyAddress.addressLine2) ? this.getTitleCase(detailData.propertyAddress.addressLine2) + '<br>' : '';
				detailData.propertyAddress.city = this.isDefined(detailData.propertyAddress.city) ? this.getTitleCase(detailData.propertyAddress.city) : defaultNull;
				detailData.propertyAddress.state = this.isDefined(detailData.propertyAddress.state) ? this.stateFormatter(detailData.propertyAddress.state) : defaultNull;
				detailData.propertyAddress.zipCode = this.isDefined(detailData.propertyAddress.zipCode) ? detailData.propertyAddress.zipCode : defaultNull;
			}
			else
			{
				detailData.propertyAddress = {}
			}

			return detailData;
		},

		/**
		 * Function for converting data for Heloc Details
		 * @function helocDetailData
		 * @param {Object} [data] contain details object
		 * @memberOf module:dataTransform
		 **/
		helocDetailData: function(detailData) {
			if (!this.isDefined(detailData)) {
                detailData = {}
            }
            if (!this.isDefined(detailData.detail)) {
                detailData.detail = {}
            }
            detailData.nickname = this.isDefined(detailData.nickname) ? detailData.nickname : defaultNull;
            detailData.mask = this.isDefined(detailData.mask) ? detailData.mask.toUpperCase().replace('X', '...') : defaultNull;
            detailData.rateLockTotalBalance = this.isDefined(detailData.rateLockTotalBalance) ? this.currencyFormat(detailData.rateLockTotalBalance) : defaultNull;

            if (detailData.detail) {
                var defaultNull = "Not available".fontcolor("#FF0000");
                detailData.detail.homePhoneNumber = this.isDefined(detailData.detail.homePhoneNumber) ? this.getPhoneNumber(detailData.detail.homePhoneNumber) : '&nbsp;';
                detailData.detail.interestRate = this.isDefined(detailData.detail.interestRate) ? this.interestFormat(detailData.detail.interestRate) + '%' : defaultNull;
                detailData.detail.originationDate = this.isDefined(detailData.detail.originationDate) ? this.splitMMDDYYYY(detailData.detail.originationDate) : defaultNull;
                detailData.detail.originalCreditLine = this.isDefined(detailData.detail.originalCreditLine) ? this.currencyFormat(detailData.detail.originalCreditLine) : defaultNull;
                detailData.detail.principalBalance = this.isDefined(detailData.detail.principalBalance) ? this.currencyFormat(detailData.detail.principalBalance) : defaultNull;
                detailData.detail.paydownFees = this.isDefined(detailData.detail.paydownFees) ? this.currencyFormat(detailData.detail.paydownFees) : defaultNull;
                detailData.detail.interestBalanceTotal = this.isDefined(detailData.detail.interestBalanceTotal) ? this.currencyFormat(detailData.detail.interestBalanceTotal) : defaultNull;
                detailData.detail.currentBalance = this.isDefined(detailData.detail.currentBalance) ? this.currencyFormat(detailData.detail.currentBalance) : defaultNull;
                detailData.detail.interestBalanceVariable = this.isDefined(detailData.detail.interestBalanceVariable) ? this.currencyFormat(detailData.detail.interestBalanceVariable) : defaultNull;
                detailData.detail.availableCredit = this.isDefined(detailData.detail.availableCredit) ? this.currencyFormat(detailData.detail.availableCredit) : defaultNull;
                detailData.detail.lastPaymentAmount = this.isDefined(detailData.detail.lastPaymentAmount) ? this.currencyFormat(detailData.detail.lastPaymentAmount) : defaultNull;
                detailData.detail.nextPaymentAmount = this.isDefined(detailData.detail.nextPaymentAmount) ? this.currencyFormat(detailData.detail.nextPaymentAmount) : defaultNull;
                detailData.detail.currentPaymentDate = this.isDefined(detailData.detail.nextPaymentDate) ? this.getNumberSuffix(this.getDayOnly(detailData.detail.nextPaymentDate)) : defaultNull;
                detailData.detail.lastPaymentDate = this.isDefined(detailData.detail.lastPaymentDate) ? this.splitMMDDYYYY(detailData.detail.lastPaymentDate) : defaultNull;
                detailData.detail.nextPaymentDate = this.isDefined(detailData.detail.nextPaymentDate) ? this.splitMMDDYYYY(detailData.detail.nextPaymentDate) : defaultNull;
                detailData.detail.interestPaidYTD = this.isDefined(detailData.detail.interestPaidYTD) ? this.currencyFormat(detailData.detail.interestPaidYTD) : defaultNull;
                detailData.detail.interestPaidLastYear = this.isDefined(detailData.detail.interestPaidLastYear) ? this.currencyFormat(detailData.detail.interestPaidLastYear) : defaultNull;

                //add for HEO
                detailData.detail.loanOriginationDate = this.isDefined(detailData.detail.loanOriginationDate) ? this.splitMMDDYYYY(detailData.detail.loanOriginationDate) : defaultNull;
                detailData.detail.feesAndCharges = this.isDefined(detailData.detail.feesAndCharges) ? this.currencyFormat(detailData.detail.feesAndCharges) : defaultNull;
                detailData.detail.originationLoanAmount = this.isDefined(detailData.detail.originationLoanAmount) ? this.currencyFormat(detailData.detail.originationLoanAmount) : defaultNull;
                detailData.detail.numberPaymentsTotal = this.isDefined(detailData.detail.numberPaymentsTotal) ? detailData.detail.numberPaymentsTotal : defaultNull;
                detailData.detail.numberPaymentsTotal = this.isDefined(detailData.detail.numberPaymentsTotal) ? detailData.detail.numberPaymentsTotals : defaultNull;

                detailData.detail.primaryFullName = this.isDefined(detailData.detail.primaryFullName) ? this.getTitleCase(detailData.detail.primaryFullName) : defaultNull;
                detailData.detail.secondaryFullName = this.isDefined(detailData.detail.secondaryFullName) ? this.getTitleCase(detailData.detail.secondaryFullName) : '';

                if (!this.isDefined(detailData.detail.asOfDate)) {
                    detailData.detail.lastYear = defaultNull;
                    detailData.detail.presentYear = defaultNull;
                    detailData.detail.asOfDate = defaultNull;
                } else {
                	detailData.detail.asOfDate = this.isDefined(detailData.detail.asOfDate) ? this.splitMMDDYYYY(detailData.detail.asOfDate) : defaultNull;
                    detailData.detail.presentYear = this.isDefined(detailData.detail.asOfDate) ? this.asOfDateFullYear(detailData.detail.asOfDate) : defaultNull;
                    detailData.detail.lastYear = detailData.detail.presentYear ? parseFloat(detailData.detail.presentYear) - 1 : defaultNull;
                }
            }

            if (!detailData.detail.rateLockTotalBalance) {
                detailData.detail.rateLockTotalBalance = '$0.00';
            } else {
                detailData.detail.rateLockTotalBalance = this.isDefined(detailData.detail.rateLockTotalBalance) ? this.currencyFormat(detailData.detail.rateLockTotalBalance) : '$0.00';
            }


            if (detailData.detail.mailingAddress) {
                detailData.detail.mailingAddress.addressLine1 = this.isDefined(detailData.detail.mailingAddress.addressLine1) ? this.getTitleCase(detailData.detail.mailingAddress.addressLine1) : null;
                detailData.detail.mailingAddress.addressLine2 = this.isDefined(detailData.detail.mailingAddress.addressLine2) ? '<br> <br>' + this.getTitleCase(detailData.detail.mailingAddress.addressLine2) + '<br> <br>' : '<br> <br>';
                detailData.detail.mailingAddress.city = this.isDefined(detailData.detail.mailingAddress.city) ? this.getTitleCase(detailData.detail.mailingAddress.city) : '';
                detailData.detail.mailingAddress.state = this.isDefined(detailData.detail.mailingAddress.state) ? ', ' + this.stateFormatter(detailData.detail.mailingAddress.state) + ' ' : '';
                detailData.detail.mailingAddress.zipCode = this.isDefined(detailData.detail.mailingAddress.zipCode) ? detailData.detail.mailingAddress.zipCode : '';
                detailData.detail.mailingAddress.zipCodeExt = this.isDefined(detailData.detail.mailingAddress.zipCodeExt) ? '-' + detailData.detail.mailingAddress.zipCodeExt : '';
            } else {
                detailData.detail.mailingAddress = {};
                detailData.detail.mailingAddress.addressLine1 = '&nbsp;';
                detailData.detail.mailingAddress.addressLine2 = '';
                detailData.detail.mailingAddress.city = '';
                detailData.detail.mailingAddress.state = '';
                detailData.detail.mailingAddress.zipCode = '';
                detailData.detail.mailingAddress.zipCodeExt = '';
            }
            detailData.detail.postalAddress = detailData.detail.mailingAddress.addressLine1 + detailData.detail.mailingAddress.addressLine2 + detailData.detail.mailingAddress.city + detailData.detail.mailingAddress.state + detailData.detail.mailingAddress.zipCode + detailData.detail.mailingAddress.zipCodeExt;

            return detailData;

		},

		interestFormat: function(interestdata){
            if(interestdata*100 %1 != 0) {
                return interestdata;
            } else {
                return interestdata.toFixed(2);
            }
        },

         /**
         * Function to get number suffix
         * @function getNumberSuffix
         * @memberOf module:dataTransform
         **/
        getNumberSuffix: function(number) {
            var j = number % 10,
                k = number % 100;
            if (j == 1 && k != 11) {
                return number + "st";
            }
            if (j == 2 && k != 12) {
                return number + "nd";
            }
            if (j == 3 && k != 13) {
                return number + "rd";
            }
            return number + "th";
        },

		/**
         * Function to get the day from YYYYMMDD
         * @function getDayOnly
         * @param {String} [currentDate] date
         * @memberOf module:dataTransform
         **/
        getDayOnly: function(k) {
            return Number(k.substr(6, 2));
        },


		rateLocksDetail: function(detail) {
			if (!this.isDefined(detail)) {
				detail = {}
			}
			var defaultNull = "Not available".fontcolor("#FF0000");
			var lock,
				locks = [];
			for (var i = 0; i < detail.rateLocks.length; i++) {
				lock = {};
				lock.loanNickName = this.isDefined(detail.rateLocks[i].name) ? detail.rateLocks[i].name : defaultNull;
				lock.loanOriginalAmount = this.isDefined(detail.rateLocks[i].originalAmount) ? this.currencyFormat(detail.rateLocks[i].originalAmount) : defaultNull;
				lock.loanCurrentBalance = this.isDefined(detail.rateLocks[i].currentBalance) ? this.currencyFormat(detail.rateLocks[i].currentBalance) : defaultNull;
				lock.loanAmountDue = this.isDefined(detail.rateLocks[i].paymentAmount) ? this.currencyFormat(detail.rateLocks[i].paymentAmount) : defaultNull;
				lock.loanInterestRate = this.isDefined(detail.rateLocks[i].interestRate) ? detail.rateLocks[i].interestRate + '%' : defaultNull;
				lock.loanStartDate = this.isDefined(detail.rateLocks[i].startDate) ? this.splitMMDDYYYY(detail.rateLocks[i].startDate) : defaultNull;
				lock.loanEndDate = this.isDefined(detail.rateLocks[i].endDate) ? this.splitMMDDYYYY(detail.rateLocks[i].endDate) : defaultNull;

				locks.push(lock);
			}
			return locks;
		},

		accountActivity: function(activityData, inputData, i, activityView, accountType) {
			var previousdate = activityView[i - 1] !== null && activityView[i - 1] !== undefined ? activityView[i - 1].date : null;
			if(accountType==='loan') {
				// code for grouping behavior
				if (previousdate !== null && previousdate === inputData[i].date) {
					activityData.transactionPostedDate = '';
					// need style the TDs dashed top border
					activityData.class = 'no bottom border';
					activityData.cellClass = 'grouped top border';
				} else {
					activityData.transactionPostedDate = this.isDefined(inputData[i].date) ? this.splitMMDDYYYY(inputData[i].date) : defaultNull;
					activityData.class = 'solid top border';
				}
			} else {
				activityData.transactionPostedDate = this.isDefined(inputData[i].date) ? this.splitMMDDYYYY(inputData[i].date) : defaultNull;
			}
			activityData.date = inputData[i].date;
			activityData.transactionDescription = this.isDefined(inputData[i].description) ? inputData[i].description : defaultNull;
			activityData.checkNumber = this.isDefined(inputData[i].checkNumber) ? inputData[i].checkNumber : '';
			activityData.transactionAmount = this.isDefined(inputData[i].amount) ? this.currencyFormat(inputData[i].amount) : defaultNull;
			activityData.interestPayment = this.isDefined(inputData[i].interest) ? this.currencyFormat(inputData[i].interest) : defaultNull;
			activityData.transactionFeesPayment = this.isDefined(inputData[i].fee) ? this.currencyFormat(inputData[i].fee) : defaultNull;
			activityData.principalPayment = this.isDefined(inputData[i].principal) ? this.currencyFormat(inputData[i].principal) : defaultNull;
			activityData.principalAmountBalance = this.isDefined(inputData[i].balance) ? this.currencyFormat(inputData[i].balance) : defaultNull;
		},

		onHoldActivityList: function(data) {
			var accountsData,
				i, account, actData,
				onHoldsData = {};

			onHoldsData.onHoldList = [];

			if (this.isDefined(data.result)) {
				onHoldsData.totalTransactionsOnHold = data.totalOnHolds;
				onHoldsData.totalValueOfHolds = this.currencyFormat(data.totalOnHoldsAmount);
				accountsData = this.objectClone(data.result);
				for (i in accountsData) {
					account = accountsData[i];
					actData = {};

					previousdate = accountsData[i - 1] !== null && accountsData[i - 1] !== undefined ? accountsData[i - 1].holdDate : null;

					actData.reasonForHold = this.isDefined(account.holdReason) ? account.holdReason : defaultNull;
					actData.transactionHoldAmount = this.currencyFormat(account.holdAmount);
					actData.transactionHoldDate = this.isDefined(account.holdDate) ? this.splitMMDDYYYY(account.holdDate) : defaultNull;
					actData.transactionHoldExpiryDate = this.isDefined(account.holdReleaseDate) ? this.splitMMDDYYYY(account.holdReleaseDate) : defaultNull;

					actData.class = '';
					actData.cellClass = '';

					if (previousdate !== null && previousdate === account.holdDate) {
						actData.transactionHoldDate = '';
						// need style the TDs dashed top border
						actData.class = 'no bottom border';
						actData.cellClass = 'grouped top border';
					} else {
						actData.class = 'solid top border';
					}

					onHoldsData.onHoldList.push(actData);
				}
			}

			return {
				onHoldData: {
					totalTransactionsOnHold: this.isDefined(onHoldsData.totalTransactionsOnHold) ? onHoldsData.totalTransactionsOnHold : 0,
					totalValueOfHolds: this.isDefined(onHoldsData.totalValueOfHolds) ? onHoldsData.totalValueOfHolds : null,
					list: onHoldsData.onHoldList.length > 0 ? onHoldsData.onHoldList : null
				}
			};
		},

		getSentenceCase: function(str) {
			return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
		},

		mortgageAccountActivity: function(activityData) {
			var mortgageActivtyView = [];
			var mortgageActivityData;
			for (var i = 0; i < activityData.length; i++) {
				mortgageActivityData = {};
				mortgageActivityData.class = i > 0 ? '' : 'first';
				mortgageActivityData.escrowPayment = this.isDefined(activityData[i].escrow) ? this.currencyFormat(activityData[i].escrow) : defaultNull;
				this.accountActivity(mortgageActivityData, activityData, i, mortgageActivtyView, 'mortgage');
				mortgageActivtyView.push(mortgageActivityData);
			}
			return mortgageActivtyView;
		},

		accountLoanDetails: function(detailData) {
			detailData.nickname = this.isDefined(detailData.nickname) ? detailData.nickname : defaultNull;
			detailData.mask = this.isDefined(detailData.mask) ? this.formatAccountMask(detailData.mask) : defaultNull;

			if (detailData.detail) {
				detailData.detail.principalBalance = this.isDefined(detailData.detail.principalBalance) ? this.currencyFormat(detailData.detail.principalBalance) : defaultNull;
				detailData.detail.nextPaymentDate = this.isDefined(detailData.detail.nextPaymentDate) ? this.splitMMDDYYYY(detailData.detail.nextPaymentDate) : defaultNull;
				detailData.detail.nextPaymentAmount = this.isDefined(detailData.detail.nextPaymentAmount) ? this.currencyFormat(detailData.detail.nextPaymentAmount) : defaultNull;
				detailData.detail.lastPaymentDate = this.isDefined(detailData.detail.lastPaymentDate) ? this.splitMMDDYYYY(detailData.detail.lastPaymentDate) : defaultNull;

				detailData.detail.lastPaymentAmount = this.isDefined(detailData.detail.lastPaymentAmount) ? this.currencyFormat(detailData.detail.lastPaymentAmount) : defaultNull;
				detailData.detail.mortgageCashBack = this.isDefined(detailData.detail.mortgageCashBack) ? this.currencyFormat(detailData.detail.mortgageCashBack) : defaultNull;
				detailData.detail.currentBalance = this.isDefined(detailData.detail.currentBalance) ? this.currencyFormat(detailData.detail.currentBalance) : defaultNull;
				detailData.detail.availableCredit = this.isDefined(detailData.detail.availableCredit) ? this.currencyFormat(detailData.detail.availableCredit) : defaultNull;
			}
			return detailData;
		},

		/**
		 * Function to get the data used in expanded controller for 'CARD' details.
		 * @function cardDetailData
		 * @param {Object} [detailType] contain the detail data of account type CARD
		 * @memberOf module:dataTransform
		 **/
		cardDetailData : function(detailData) {
			if(!this.isDefined(detailData)){
				detailData = {}
			}
			if(!this.isDefined(detailData.detail)){
				detailData.detail = {}
			}
			detailData.nickname = this.isDefined(detailData.nickname) ? this.getTitleCase(detailData.nickname) : defaultNull;
			detailData.mask = this.isDefined(detailData.mask) ? detailData.mask.toUpperCase().replace('X', '...') : defaultNull;
			detailData.displayName = detailData.nickname + '(' + detailData.mask + ')';
			if (detailData.detail){
				var defaultNull = "Not available".fontcolor("#FF0000");
				detailData.detail.currentBalance = this.isDefined(detailData.detail.currentBalance) ? this.currencyFormat(detailData.detail.currentBalance) : defaultNull;
				detailData.detail.pendingChargesAmount = this.isDefined(detailData.detail.pendingChargesAmount) ? this.currencyFormat(detailData.detail.pendingChargesAmount) : defaultNull;
				detailData.detail.availableCredit = this.isDefined(detailData.detail.availableCredit) ? this.currencyFormat(detailData.detail.availableCredit) : defaultNull;
				detailData.detail.creditLimit = this.isDefined(detailData.detail.creditLimit) ? this.currencyFormat(detailData.detail.creditLimit) : defaultNull;
				detailData.detail.blueprintNextPaymentAmount = this.isDefined(detailData.detail.blueprintNextPaymentAmount) ? this.currencyFormat(detailData.detail.blueprintNextPaymentAmount) : defaultNull;
				detailData.detail.cardCashAdvanceBalance = this.isDefined(detailData.detail.cardCashAdvanceBalance) ? this.currencyFormat(detailData.detail.cardCashAdvanceBalance) : defaultNull;
				detailData.detail.cashAdvanceBalance = this.isDefined(detailData.detail.cashAdvanceBalance) ? this.currencyFormat(detailData.detail.cashAdvanceBalance) : defaultNull;
				detailData.detail.cashAdvanceLimit = this.isDefined(detailData.detail.cashAdvanceLimit) ? this.currencyFormat(detailData.detail.cashAdvanceLimit) : defaultNull;
				detailData.detail.purchaseAPR = this.isDefined(detailData.detail.purchaseAPR) ? detailData.detail.purchaseAPR + '%' : defaultNull;
				detailData.detail.lastPaymentAmount = this.isDefined(detailData.detail.lastPaymentAmount) ? this.currencyFormat(detailData.detail.lastPaymentAmount) : defaultNull;
				detailData.detail.lastPaymentDate = this.isDefined(detailData.detail.lastPaymentDate) ? this.splitMMDDYYYY(detailData.detail.lastPaymentDate) : defaultNull;
				detailData.detail.nextPaymentAmount = this.isDefined(detailData.detail.nextPaymentAmount) ? this.currencyFormat(detailData.detail.nextPaymentAmount) : defaultNull;
				detailData.detail.nextPaymentDueDate = this.isDefined(detailData.detail.nextPaymentDueDate) ? this.splitMMDDYYYY(detailData.detail.nextPaymentDueDate) : defaultNull;
				detailData.detail.lastStmtBalance = this.isDefined(detailData.detail.lastStmtBalance) ? this.currencyFormat(detailData.detail.lastStmtBalance) : defaultNull;
				detailData.detail.lastStmtDate = this.isDefined(detailData.detail.lastStmtDate) ? this.splitMMDDYYYY(detailData.detail.lastStmtDate) : defaultNull;
				detailData.detail.cashAPR = this.isDefined(detailData.detail.cashAPR) ? detailData.detail.cashAPR + '%' : defaultNull;
				if (detailData.detail.lastStmtBalance == defaultNull) {
					if (detailData.detail.lastStmtDate == defaultNull) {
						detailData.lastStmMsg = defaultNull
					} else {
						detailData.lastStmMsg = detailData.detail.lastStmtDate;
					}
				} else {
					if (detailData.detail.lastStmtDate == defaultNull) {
						detailData.lastStmMsg = detailData.detail.lastStmtBalance;
					} else {
						detailData.lastStmMsg = detailData.detail.lastStmtBalance + ' on ' + detailData.detail.lastStmtDate;
					}
				}
				if (detailData.detail.lastPaymentAmount == defaultNull) {
					if (detailData.detail.lastPaymentDate == defaultNull) {
						detailData.lastPaymentMsg = defaultNull
					} else {
						detailData.lastPaymentMsg = 'Was paid on ' + detailData.detail.lastPaymentDate;
					}
				} else {
					if (detailData.detail.lastPaymentDate == defaultNull) {
						detailData.lastPaymentMsg = detailData.detail.lastPaymentAmount +' was received.';
					} else {
						detailData.lastPaymentMsg = detailData.detail.lastPaymentAmount + ' was paid on ' + detailData.detail.lastPaymentDate;
					}
				}
				if (detailData.detail.nextPaymentAmount == defaultNull) {
					if (detailData.detail.nextPaymentDueDate == defaultNull) {
						detailData.minPaymentMsg = defaultNull
					} else {
						detailData.minPaymentMsg = 'Is due on ' + detailData.detail.nextPaymentDueDate + '. The payment amount due for your next payment is not currently available.';
					}
				} else {
					if (detailData.detail.nextPaymentDueDate == defaultNull) {
						detailData.minPaymentMsg = detailData.detail.nextPaymentAmount +' is due. The date your next payment is due is not currently available.';
					} else {
						detailData.minPaymentMsg = detailData.detail.nextPaymentAmount + ' is due on ' + detailData.detail.nextPaymentDueDate;
					}
				}
				if (detailData.detail.lastStmtDate == defaultNull) {
					detailData.aprHeaderMsg = 'APR on your last statement'
				} else {
					detailData.aprHeaderMsg = 'APR as of ' + detailData.detail.lastStmtDate
				}
			}
			return detailData;
		},

		/**
		 * Function to Format the Phone Number
		 * @function getPhoneNumber
		 * @memberOf module:dataTransform
		 **/
		getPhoneNumber: function(str) {
			var phone = str.match(/\d/g);
			phone = phone.join("");
			if (phone.length !== 10) {
				return null;
			} else {
				return '(' + phone.substr(0, 3) + ') ' + phone.substr(3, 3) + '-' + phone.substr(6, 4);
			}

		},

		loanAccountActivity: function(activityData) {
			var helActivityView = [],
				helActivityData;
			for (var i = 0; i < activityData.length; i++) {
				helActivityData = {};
				this.accountActivity(helActivityData, activityData, i, helActivityView, 'loan');
				helActivityView.push(helActivityData);
			}
			return helActivityView;
		},

		/**
		 * Function to list the card account names from cardNames object.
		 * @function prepaidOwnerData
		 * @param {Object} [cardNames] contain list of card names
		 * @memberOf module:dataTransform
		 **/
		prepaidOwnerData: function(cardNames) {
			var i, cardNamesList = [], cardNamesObj = {};

			for (i = 0; i < cardNames.length; i++) {
				if (cardNames.hasOwnProperty(i)) {
					cardNamesObj = {};
					cardNamesObj.indexNo = ' ' + Number(i + 1);
					cardNamesObj.cardName = this.getTitleCase(this.formatAccountMask(cardNames[i]));
				}
				cardNamesList.push(cardNamesObj);
			}
			return cardNamesList;
		},

		/**
		 * Function to get the account group for a given detail account type.
		 * @function getParentAccountType
		 * @param {Object} [detailType] contain the detail account type
		 * @memberOf module:dataTransform
		 **/
		getParentAccountType: function(detailType) {
			var accountType = '';
			switch (detailType) {
				case 'CHK':
				case 'SAV':
				case 'MMA':
					accountType = 'DDA';
					break;
				case 'HEL':
				case 'RCA':
				case 'HEO':
				case 'ILA':
					accountType = 'LOAN';
					break;
				case 'PAC':
				case 'BAC':
				case 'OLC':
					accountType = 'CARD';
					break;
				case 'PPX':
				case 'PPA':
					accountType = 'PrePaid';
					break;
				case 'CDA':
				case 'IRA':
					accountType = 'CDA';
					break;
				default:
					accountType = 'DDA';
					break;
			}
			return accountType;
		},


		/**
		 * Function to get formatted account activity
		 * @function accountActivityList
		 * @param {Object} [data] contains any object
		 * @param {String} [accType] contain any string
		 * @memberOf module:dataTransform
		 **/
		depositAccountActivityList: function(data, filterData, accType) {
			var activityList = [];

			if (this.isDefined(data)) {
				var accountsData = this.objectClone(data),
					i, account, actData, previousdate = null;

				for (i in accountsData) {
					account = accountsData[i];

					previousdate = activityList[i - 1] !== null && activityList[i - 1] !== undefined ? activityList[i - 1].date : null;

					actData = {};

					actData.date = account.date;

					actData.transactionDescription = this.isDefined(account.description) ? account.description : defaultNull;

					actData.positive = this.isDefined(account.credit) && account.credit ? true : false;

					actData.transactionAmount = this.isDefined(account.credit) && account.credit ? this.currencyFormat(account.amount) : this.currencyFormat(account.amount * -1);

					actData.transactionPostedDate = this.isDefined(account.date) ? this.splitMMDDYYYY(account.date) : defaultNull;
					actData.accountBalance = this.isDefined(account.balance) ? this.currencyFormat(account.balance) : defaultNull;
					actData.cardNumber = this.isDefined(account.card) ? account.card : '';

					// Make class names non-null. (don't want to emit <tr class>)
					actData.class = '';
					actData.cellClass = '';

					//If transaction is pending, show "Pending" in date field and display null in Balance field.
					if (account.pending) {
						actData.transactionPostedDate = 'Pending';
						actData.accountBalance = '';
					}

					actData.transactionType = this.isDefined(account.type) ? this.languageMapper.getLocaleMessage('TRANSACTION_TYPE')[account.type] : defaultNull;

					if (previousdate !== null && previousdate === account.date) {
						actData.transactionPostedDate = '';
						// need style the TDs dashed top border
						actData.class = 'no bottom border';
						actData.cellClass = 'grouped top border';
					} else {
						actData.class = 'solid top border';
					}

					//If transaction is pending, show "Pending" in date field and display null in Balance field.
					//Pending transactions should not be grouped by date.
					if (account.pending) {
						actData.transactionPostedDate = 'Pending';
						actData.accountBalance = '';
						actData.cellClass = '';
						actData.class = 'solid top border';
					}

					actData.showBalance = this.showBalanceColumn(filterData);
					activityList.push(actData);
				}
			}
			return {
				activityData: {
					list: activityList.length > 0 ? activityList : null
				}
			};
		},

		/**
		 * Function to determine to show or hide balance column in account activity
		 * @function showBalanceColumn
		 * @param {Object} [filterData] contains any object
		 * @memberOf module:dataTransform
		 **/
		showBalanceColumn: function(filterData) {
			if (filterData.isFilterBy) {
				return filterData.transactionType === 'ALL' && filterData.dateLo === undefined && filterData.dateHi === undefined && filterData.dateOption === undefined && filterData.amountLo === undefined && filterData.amountHi === undefined && filterData.checkLo === undefined && filterData.checkLo === undefined ? true : false;
			}
			return true;
		},

		/**
		 * Function to separate pending/posted account activity
		 * @function cardActivityGroupList
		 * @param {Object} [data] contains any object
		 * @param {String} [accType] contain any string
		 * @memberOf module:dataTransform
		 **/
		cardActivityGroupList: function(data, accType) {
			var accountsData,
				account, actData,
				postedList = [];
			pendingList = [];
			postedActivityList = [];
			pendingActivityList = [];

			if (data.result) {
				accountsData = this.objectClone(data.result);
				for (var i in accountsData) {
					if (accountsData[i].pending) {
						pendingList.push(accountsData[i]);
					}
				}
				for (var j in accountsData) {
					if (!accountsData[j].pending) {
						postedList.push(accountsData[j]);
					}
				}

				pendingActivityList = this.getCardActivityGroup(pendingList);
				postedActivityList = this.getCardActivityGroup(postedList);
			}
			return {
				pendingData: {
					list: 0 < pendingActivityList.length ? pendingActivityList : null
				},
				postedData: {
					list: 0 < postedActivityList.length ? postedActivityList : null
				}
			}
		},

		/**
		 * Function to create filter criteria description
		 * @function cardFilterCriteriaDescription
		 * @param {Object} [data] contains any object
		 * @param {Boolean} [isFilterBy] contains filterBy data
		 * @memberOf module:dataTransform
		 **/
		cardFilterCriteriaDescription: function(data, isFilterBy) {
			var description, list = [], tranDescription, statementDescription;
			if (isFilterBy) {
				if (this.isDefined(data.statementPeriodId) && data.statementPeriodId !== 'ALL' && data.statementPeriodId !== 'DATE_RANGE') {
					statementDescription = this.languageMapper.getLocaleMessage('TRANSACTION_TYPE')[data.statementPeriodId];
					list.push(statementDescription);
				}
				if (this.isDefined(data.filterTranType) && data.filterTranType !== 'ALL') {
					tranDescription = this.languageMapper.getLocaleMessage('TRANSACTION_TYPE')[data.filterTranType];
					list.push(tranDescription);
				}
				if (this.isDefined(data.dateHiStr) && this.isDefined(data.dateLoStr)) {
					list.push(this.transToMMMDDYYYY(data.dateLoStr) + ' to ' + this.transToMMMDDYYYY(data.dateHiStr));
				}
				if (this.isDefined(data.amountHi) && this.isDefined(data.amountLo)) {
					list.push('$' + data.amountLo + ' to $' + data.amountHi);
				}
				if (this.isDefined(data.filterKeyword)) {
					list.push(data.filterKeyword);
				}
			}
			return list;
		},

		/**
		 * Function to get formatted account activity
		 * @function getCardActivityGroup
		 * @param {Object} [data] contains any object
		 * @param {String} [accType] contain any string
		 * @memberOf module:dataTransform
		 **/
		getCardActivityGroup: function(accountsData) {
			var i, account, actData, previousdate = null,
				activityList = [];

			for (i in accountsData) {
				account = accountsData[i];
				actData = {};
				actData.date = account.postDate;
				actData.transDate = account.transactionDate;
				previousdate = activityList[i - 1] !== null && activityList[i - 1] !== undefined ? activityList[i - 1].date : null;
				actData.transactionId = this.isDefined(account.transactionId) ? account.transactionId.replace('#', '_') : defaultNull; //TODO: id contains # which is an issue for jquery selection
				actData.transactionDescription = this.isDefined(account.description) ? account.description : defaultNull;
				actData.possitive = this.isDefined(account.credit) && account.credit ? true : false;
				actData.transactionAmount = this.isDefined(account.credit) && account.credit ? this.currencyFormat(account.amount) : this.currencyFormat(account.amount);
				actData.transactionInitiationDate = this.isDefined(actData.transDate) ? this.splitMMDDYYYY(actData.transDate) : defaultNull;
				actData.transactionPostedDate = this.isDefined(actData.date) ? this.splitMMDDYYYY(actData.date) : defaultNull;
				actData.transactionType = this.isDefined(account.type) ? this.languageMapper.getLocaleMessage('TRANSACTION_TYPE')[account.type] : defaultNull;
				actData.merchantAddress = '';
				actData.transactionNumber = '';
				actData.transactionChannel = '';
				actData.transactionRewards = [];
				actData.totalTransactionRewardsEarned = '';
				actData.blink = false;

				// Make class names non-null. (don't want to emit <tr class>)
				actData.class = '';
				actData.cellClass = '';

				if (previousdate !== null && previousdate === actData.date) {
					actData.transactionInitiationDate = '';
					// need style the TDs dashed top border
					actData.class = 'no bottom border';
					actData.cellClass = 'grouped top border';
				} else {
					actData.class = 'solid top border';
				}
				activityList.push(actData);
			}

			return activityList;
		},

		cardTransactionDetails: function(detailsData) {
			var details = {},
				rewardsInfo;

			details.blink = (this.isDefined(detailsData.blink) && detailsData.blink) ? true : false;
			details.merchantAddress = this.isDefined(detailsData.merchantAddress) ? detailsData.merchantAddress : null;
			details.transactionNumber = this.isDefined(detailsData.transactionRefNum) ? detailsData.transactionRefNum : null;
			details.transactionChannel = this.isDefined(detailsData.terminalEntryDesc) ? detailsData.terminalEntryDesc : null;
			if (this.isDefined(detailsData.totalTransactionRewards) && this.isDefined(detailsData.totalTransactionRewards.earnedReward)) {
				details.totalTransactionRewardsEarned = this.isDefined(detailsData.totalTransactionRewards.earnedReward) ? detailsData.totalTransactionRewards.earnedReward : defaultNull;
			}
			details.transactionId = this.isDefined(detailsData.transactionId) ? detailsData.transactionId : defaultNull;

			details.transactionRewards = [];
			rewardsInfo = detailsData.transactionRewards;

			for (var i in rewardsInfo) {
				details.transactionRewards.push({
					rewardsEarned: rewardsInfo[i].earnedReward,
					rewardsDescription: rewardsInfo[i].rewardDescription
				});
			}
			return details;
		},

		/**
		 * Function to determine to show or hide balance column in account activity
		 * @function showBalanceColumn
		 * @param {Object} [filterData] contains any object
		 * @memberOf module:dataTransform
		 **/
		showBalanceColumn: function(filterData) {
			if (filterData.isFilterBy) {
				return filterData.transactionType === 'ALL' && filterData.dateLo === undefined && filterData.dateHi === undefined && filterData.dateOption === undefined && filterData.amountLo === undefined && filterData.amountHi === undefined && filterData.checkLo === undefined && filterData.checkLo === undefined ? true : false;
			}
			return true;
		},

		/**
		 * Function to create filter criteria based on the user input
		 * @function ddaFilterAccountActivity
		 * @param {Object} [data] contains any object
		 * @memberOf module:dataTransform
		 **/
		ddaFilterAccountActivity: function(data) {
			var filterData = {};
			filterData.accountId = data.accountId;

			if (data.isFilterBy) {
				if (this.isDefined(data.dateLo)) {
					if (this.isDefined(data.dateHi)) {
						filterData.dateLoStr = data.dateLo;
						filterData.dateHiStr = data.dateHi;
					} else {
						filterData.dateLoStr = data.dateLo;
						filterData.dateHiStr = this.getFormattedDate(new Date());
					}
					filterData.dateLo = this.getFormattedDateYYYYMMDD(filterData.dateLoStr);
					filterData.dateHi = this.getFormattedDateYYYYMMDD(filterData.dateHiStr);
				}
				if (this.isDefined(data.amountLo) && this.isDefined(data.amountHi)) {
					filterData.amountLo = data.amountLo;
					filterData.amountHi = data.amountHi;
				}
				if (this.isDefined(data.checkLo) && this.isDefined(data.checkHi)) {
					filterData.checkLo = data.checkLo;
					filterData.checkHi = data.checkHi;
				}
				if (this.isDefined(data.dateOption)) {
					filterData.dateOption = data.dateOption;
				}
				filterData.transactionType = this.isDefined(data.transactionType) ? data.transactionType : null;
			}
			return filterData;
		},

		/**
		 * Function to create filter criteria based on the user input
		 * @function cardFilterAccountActivity
		 * @param {Object} [data] contains any object
		 * @memberOf module:dataTransform
		 **/
		cardFilterAccountActivity: function(data) {
			var filterData = {};
			filterData.accountId = data.accountId;

			if (data.isFilterBy) {
				if (this.isDefined(data.dateLo)) {
					if (this.isDefined(data.dateHi)) {
						filterData.dateLoStr = data.dateLo;
						filterData.dateHiStr = data.dateHi;
					} else {
						filterData.dateLoStr = data.dateLo;
						filterData.dateHiStr = this.getFormattedDate(new Date());
					}
					filterData.dateLo = this.getFormattedDateYYYYMMDD(filterData.dateLoStr);
					filterData.dateHi = this.getFormattedDateYYYYMMDD(filterData.dateHiStr);
				}
				if (this.isDefined(data.amountLo) && this.isDefined(data.amountHi)) {
					filterData.amountLo = data.amountLo;
					filterData.amountHi = data.amountHi;
				}
				if (this.isDefined(data.merchantName)) {
					filterData.filterKeyword = data.merchantName;
				}
				filterData.statementPeriodId = this.isDefined(data.statementTimePeriod) ? data.statementTimePeriod : null;
				filterData.filterTranType = this.isDefined(data.transactionType) ? data.transactionType : null;
			}
			return filterData;
		},

		/**
		 * Function to create filter criteria description
		 * @function ddaFilterCriteriaDescription
		 * @param {Object} [data] contains any object
		 * @param {Boolean} [isFilterBy] contains filterBy data
		 * @memberOf module:dataTransform
		 **/
		ddaFilterCriteriaDescription: function(data, isFilterBy) {
			var description, list = [],
				tranType, tranDescription;
			if (isFilterBy) {
				if (this.isDefined(data.transactionType)) {
					tranType = data.transactionType;
					tranType = tranType.substr(tranType.length - 1) === 'S' ? tranType.substr(0, tranType.length - 1) : tranType;
					tranDescription = this.languageMapper.getLocaleMessage('TRANSACTION_TYPE')[tranType];
					if (tranDescription !== 'All Transactions'){
						list.push(tranDescription);
					}
				}
				if (this.isDefined(data.dateHiStr) && this.isDefined(data.dateLoStr)) {
					list.push(this.transToMMMDDYYYY(data.dateLoStr) + ' to ' + this.transToMMMDDYYYY(data.dateHiStr));
				}
				if (this.isDefined(data.amountHi) && this.isDefined(data.amountLo)) {
					list.push('$' + data.amountLo + ' to $' + data.amountHi);
				}
				if (this.isDefined(data.checkHi) && this.isDefined(data.checkLo)) {
					list.push('Checks ' + data.checkLo + ' to ' + data.checkHi);
				}
			}
			return list;
		},

		specificTransactionTypeOnlyCriteria: function(data) {
			return (this.isDefined(data.transactionType) && data.transactionType !== 'ALL' && (this.isDefined(data.dateLo) ||
				(this.isDefined(data.amountLo) && this.isDefined(data.amountHi)) ||
				this.isDefined(data.checkLo) && this.isDefined(data.checkHi) ||
				this.isDefined(data.dateOption))) ? false : true;
		},
		transactionTypeAndOtherCriteria: function(data) {
			return (this.isDefined(data.dateLo) ||
				(this.isDefined(data.amountLo) && this.isDefined(data.amountHi)) ||
				this.isDefined(data.checkLo) && this.isDefined(data.checkHi) ||
				this.isDefined(data.dateOption)) ? true : false;
		},
		/**
		 * Trans Date from 'MM/DD/YYYY' to 'MMM DD, YYYY'
		 **/
		transToMMMDDYYYY: function(transDate) {
			return this.languageMapper.getLocaleMessage('MONTH')[transDate.substr(0, 2)] + ' ' + Number(transDate.substr(3, 2)) + ', ' + transDate.substr(6, 4);
		},

		/**
		 * Function to create dropdown options for transaction types dropdown
		 * @function createDropdownOptions
		 * @param {Object} [detailType] contains any object
		 * @memberOf module:dataTransform
		 **/
		createDropdownOptions: function(detailType) {
			var dropdownOptions = [];
			dropdownOptions.push(this.createDropdownOption('ALL'));
			dropdownOptions.push(this.createDropdownOption('CREDITS'));
			dropdownOptions.push(this.createDropdownOption('DEBITS'));
			switch (detailType) {
				case 'CHK':
					dropdownOptions.push(this.createDropdownOption('ACCT_XFERS'));
					dropdownOptions.push(this.createDropdownOption('ACH_CREDITS'));
					dropdownOptions.push(this.createDropdownOption('ACH_DEBITS'));
					dropdownOptions.push(this.createDropdownOption('ADJUSTMT_REVERSALS'));
					dropdownOptions.push(this.createDropdownOption('ATMS'));
					dropdownOptions.push(this.createDropdownOption('BILLPAYS'));
					dropdownOptions.push(this.createDropdownOption('QUICKPAY_CREDITS'));
					dropdownOptions.push(this.createDropdownOption('QUICKPAY_DEBITS'));
					dropdownOptions.push(this.createDropdownOption('CHECK_WITHDRAWS'));
					dropdownOptions.push(this.createDropdownOption('DEBIT_CARDS'));
					dropdownOptions.push(this.createDropdownOption('DEPOSITS'));
					dropdownOptions.push(this.createDropdownOption('FEE_TRANSACTION'));
					dropdownOptions.push(this.createDropdownOption('WIRE_INCOMINGS'));
					dropdownOptions.push(this.createDropdownOption('LOAN_PMTS'));
					dropdownOptions.push(this.createDropdownOption('MISC_CREDITS'));
					dropdownOptions.push(this.createDropdownOption('MISC_DEBITS'));
					dropdownOptions.push(this.createDropdownOption('WIRE_OUTGOINGS'));
					dropdownOptions.push(this.createDropdownOption('OVERNIGHT_CHECKS'));
					dropdownOptions.push(this.createDropdownOption('REFUND_TRANSACTION'));
					dropdownOptions.push(this.createDropdownOption('DEPOSIT_RETURNS'));
					break;
				case 'SAV':
				case 'MMA':
					dropdownOptions.push(this.createDropdownOption('ACCT_XFERS'));
					dropdownOptions.push(this.createDropdownOption('ACH_CREDITS'));
					dropdownOptions.push(this.createDropdownOption('ACH_DEBITS'));
					dropdownOptions.push(this.createDropdownOption('ADJUSTMT_REVERSALS'));
					dropdownOptions.push(this.createDropdownOption('ATMS'));
					dropdownOptions.push(this.createDropdownOption('DEBIT_CARDS'));
					dropdownOptions.push(this.createDropdownOption('DEPOSITS'));
					dropdownOptions.push(this.createDropdownOption('FEE_TRANSACTION'));
					dropdownOptions.push(this.createDropdownOption('WIRE_INCOMINGS'));
					dropdownOptions.push(this.createDropdownOption('MISC_CREDITS'));
					dropdownOptions.push(this.createDropdownOption('MISC_DEBITS'));
					dropdownOptions.push(this.createDropdownOption('WIRE_OUTGOINGS'));
					dropdownOptions.push(this.createDropdownOption('REFUND_TRANSACTION'));
					dropdownOptions.push(this.createDropdownOption('DEPOSIT_RETURNS'));
					break;
				case 'PPX':
				case 'PPA':
					dropdownOptions.push(this.createDropdownOption('ACCT_XFERS'));
					dropdownOptions.push(this.createDropdownOption('ACH_CREDITS'));
					dropdownOptions.push(this.createDropdownOption('ADJUSTMT_REVERSALS'));
					dropdownOptions.push(this.createDropdownOption('ATMS'));
					dropdownOptions.push(this.createDropdownOption('DEPOSITS'));
					dropdownOptions.push(this.createDropdownOption('FEE_TRANSACTION'));
					dropdownOptions.push(this.createDropdownOption('MISC_CREDITS'));
					dropdownOptions.push(this.createDropdownOption('MISC_DEBITS'));
					var optionObj = this.createDropdownOption('DEBIT_CARDS');
					dropdownOptions.push({
						name: optionObj.name.replace('Debit', 'Prepaid'),
						value: optionObj.value
					});
					dropdownOptions.push(this.createDropdownOption('REFUND_TRANSACTION'));
					dropdownOptions.push(this.createDropdownOption('DEPOSIT_RETURNS'));
					break;
				default:
					break;
			}
			return dropdownOptions;
		},

		/**
		 * Function to create each dropdown option
		 * @function createDropdownOption
		 * @param {String} [value] contains string
		 * @memberOf module:dataTransform
		 **/
		createDropdownOption: function(value) {
			var option = {},
				newValue = value.substr(value.length - 1) === 'S' ? value.substr(0, value.length - 1) : value;
			option.name = this.languageMapper.getLocaleMessage('TRANSACTION_TYPE')[newValue];
			option.value = value;
			return option;
		},

		/**
		 * Function to create statement options dropdown
		 * @function createStatementOptions
		 * @param {Object} [statementTypeOptions] contains options
		 * @memberOf module:dataTransform
		 **/
		createStatementOptions: function(statementTypeOptions) {
			var statementOptions = [];
			if (statementTypeOptions && statementTypeOptions.length > 0) {
				for (var i in statementTypeOptions) {
					statementOptions.push({
						name: statementTypeOptions[i].statementPeriodDescription,
						value: statementTypeOptions[i].statementPeriodId
					});
				}
			}
			return statementOptions;
		},

		createTimePeriodOptions: function(statementTypeOptions) {
			var timePeriodOptions = [];

			if (statementTypeOptions && statementTypeOptions.length > 0) {
				for (var i in statementTypeOptions) {
					timePeriodOptions.push({
						name: statementTypeOptions[i].statementPeriodDescription.indexOf('Ending') !== -1 ?
							'Your ' + statementTypeOptions[i].statementPeriodDescription.substr(statementTypeOptions[i].statementPeriodDescription.indexOf('Ending') + 7) + ' statement' : statementTypeOptions[i].statementPeriodDescription,
						value: statementTypeOptions[i].statementPeriodId
					});
				}
				timePeriodOptions.push({
					name: 'Specific date range',
					value: 'DATE_RANGE'
				});
			}
			return timePeriodOptions;
		},

		/**
		 * Function to create transaction type options dropdown
		 * @function createTranTypeOptions
		 * @param {Object} [tranTypeOptions] contains options
		 * @memberOf module:dataTransform
		 **/
		createTranTypeOptions: function(tranTypeOptions) {
			var transactionOptions = [];
			if (tranTypeOptions && tranTypeOptions.length > 0) {
				for (var i in tranTypeOptions) {
					transactionOptions.push({
						name: tranTypeOptions[i] === 'ALL' ? 'All' : this.languageMapper.getLocaleMessage('TRANSACTION_TYPE')[tranTypeOptions[i]],
						value: tranTypeOptions[i]
					});
				}
			}
			return transactionOptions;
		},

		/**
		 * Function to create date range options
		 * @function getDateRangeByOption
		 * @param {String} [selectedOption] contains string
		 * @memberOf module:dataTransform
		 **/
		getDateRangeByOption: function(selectedOption) {
			var splitRange = {},
				fromDate = (new Date().getMonth() + 1) + '/' + new Date().getDate() + '/' + new Date().getFullYear(),
				toDate = '';
			splitRange.to = this.getFormattedDate(new Date());

			switch (selectedOption) {
				case 'CURRENT_DAY':
					splitRange.from = this.getFormattedDate(new Date());
					break;
				case 'PREVIOUS_DAY':
					toDate = this.addDays(-1);
					splitRange.to = this.getFormattedDate(toDate);
					splitRange.from = this.getFormattedDate(toDate);
					break;
				case 'LAST_7_DAYS':
					toDate = this.addDays(-7);
					splitRange.from = this.getFormattedDate(toDate);
					break;
				case 'LAST_14_DAYS':
					toDate = this.addDays(-14);
					splitRange.from = this.getFormattedDate(toDate);
					break;
				case 'LAST_1_MONTH':
					toDate = this.addMonths(-1);
					splitRange.from = this.getFormattedDate(toDate);
					break;
				case 'LAST_2_MONTHS':
					toDate = this.addMonths(-2);
					splitRange.from = this.getFormattedDate(toDate);
					break;
				case 'LAST_3_MONTHS':
					toDate = this.addMonths(-3);
					splitRange.from = this.getFormattedDate(toDate);
					break;
				case 'LAST_4_MONTHS':
					toDate = this.addMonths(-4);
					splitRange.from = this.getFormattedDate(toDate);
					break;
				case 'LAST_6_MONTHS':
					toDate = this.addMonths(-6);
					splitRange.from = this.getFormattedDate(toDate);
					break;
				case 'LAST_12_MONTHS':
					toDate = this.addMonths(-12);
					splitRange.from = this.getFormattedDate(toDate);
					break;
				case 'LAST_24_MONTHS':
					toDate = this.addMonths(-24);
					splitRange.from = this.getFormattedDate(toDate);
					break;
				default:
					break;
			}
			return splitRange;
		},

		/**
		 * Function to add days based on the selected option
		 * @function addDays
		 * @param {Integer} [days] contains number
		 * @memberOf module:dataTransform
		 **/
		addDays: function(days) {
			var result = new Date();
			result.setDate(new Date().getDate() + days);
			return result;
		},

		/**
		 * Function to add months based on the selected option
		 * @function addMonths
		 * @param {Integer} [months] contains number
		 * @memberOf module:dataTransform
		 **/
		addMonths: function(months) {
			var result = new Date();
			result.setMonth(new Date().getMonth() + months);
			return result;
		},

		/**
		 * Function to get the date in MM/DD/YYYY format
		 * @function getFormattedDate
		 * @param {Object} [date] contains object
		 * @memberOf module:dataTransform
		 **/
		getFormattedDate: function(date) {
			var year = date.getFullYear();
			var month = (1 + date.getMonth()).toString();
			month = month.length > 1 ? month : '0' + month;
			var day = date.getDate().toString();
			day = day.length > 1 ? day : '0' + day;
			return month + '/' + day + '/' + year;
		},

		/**
		 * Function to get the date in MM/DD/YYYY format
		 * @function getFormattedDate
		 * @param {Object} [date] contains object
		 * @memberOf module:dataTransform
		 **/
		getFormattedDateYYYYMMDD: function(datestr) {
			var date = new Date(datestr);
			var year = date.getFullYear();
			var month = (1 + date.getMonth()).toString();
			month = month.length > 1 ? month : '0' + month;
			var day = date.getDate().toString();
			day = day.length > 1 ? day : '0' + day;
			return year + month + day;
		},

		/**
		 * Function to determine the non-interest bearing account
		 * @function isNonInterestTypeAccount
		 * @param {Object} [detailsData] contain details object
		 * @memberOf module:dataTransform
		 **/
		isNonInterestTypeAccount: function(detailsData) {
			var interestRate = (this.isDefined(detailsData) && this.isDefined(detailsData.interestRate)) ? detailsData.interestRate : 0,
				ytdInterest = (this.isDefined(detailsData) && this.isDefined(detailsData.ytdInterest)) ? detailsData.ytdInterest : 0,
				validDetailType = (this.isDefined(detailsData) && detailsData.detailType === 'CHK') ? true : false;
			return (validDetailType && interestRate === 0 && ytdInterest === 0);
		},

		/**
		 * Function for converting data to Activity with Pedning/Posting group
		 * @function activityGroupList
		 * @param {Object} [data] contain any object
		 * @param {String} [accType] contain any string
		 * @memberOf module:dataTransform
		 **/
		// activityGroupList: function(data, accType) {
		//     var accTypeMapper = this.getLocaleMessage,
		//         actountsData = this.objectClone(data),
		//         actKey, i, actData, actDate,
		//         pendingGroup = [],
		//         postedGroup = [];

		//     for (i in actountsData) {

		//         actData = this.accountAmountInfo(actountsData[i], accType);
		//         actData.count = 'list' + i;
		//         actKey = actData.pending ? 'pending' : 'posted';
		//         actDate = actData.date;
		//         actData.eDate = this.isDefined(actDate) ? this.splitMMDDYYYY(actDate) : actDate;
		//         switch (actKey) {
		//             case 'pending':
		//                 actData.class = 0 < pendingGroup.length ? '' : 'first';
		//                 pendingGroup.push(actData);
		//                 break;
		//             case 'posted':
		//                 actData.class = 0 < postedGroup.length ? '' : 'first';
		//                 postedGroup.push(actData);
		//                 break;
		//         }
		//     }
		//     return {
		//         pendingData: {
		//             heading: accTypeMapper('pending'),
		//             list: 0 < postedGroup.length ? pendingGroup : null
		//         },
		//         postedData: {
		//             heading: accTypeMapper('posted'),
		//             list: 0 < postedGroup.length ? postedGroup : null
		//         }
		//     };
		// },

		getFootNote: function(type) {
			var accounts = JSON.stringify(type);

			if (accounts.indexOf('CARD') !== -1) {
				return this.statusCodeMapper.getAccountsMessage('CARD_PRIVACY_NOTE');
			}
			return '';
		},

		// isPositive: function(amount) {
		//     return (0 < parseFloat(amount)) ? true : false;
		// },

		/**
		 * Function for validate whether is isEmptyObject
		 * @function isEmptyObject
		 * @param {Object} [obj] contain any object
		 * @memberOf module:dataTransform
		 **/
		// isEmptyObject: function(obj) {
		//     return (Object.getOwnPropertyNames(obj).length === 0);
		// },

		/**
		 * Function for convert amount and date based on acc type for activity
		 * @function isDefined
		 * @param {String} [data] contain any string
		 * @memberOf module:dataTransform
		 **/
		accountAmountInfo: function(actData, accountType) {
			actData.possitive = this.isDefined(actData.credit) && actData.credit ? true : false;
			switch (accountType) {
				case 'DDA':
					actData.date = actData.date;
					actData.amount = this.debitOrCreditCurrency(actData.credit, actData.amount);
					break;
				case 'CARD':
					actData.date = actData.postDate;
					actData.amount = this.currencyFormat(actData.amount);
					break;
				case 'AUTOLEASE':
				case 'AUTOLOAN':
					actData.date = actData.effectiveDate;
					actData.amount = this.currencyFormat(actData.payment);
					break;
				case 'LOAN':
					actData.date = actData.effectiveDate;
					actData.amount = this.currencyFormat(actData.amount);
					break;
				case 'MORTGAGE':
					actData.date = actData.date;
					actData.amount = this.currencyFormat(actData.amount);
					break;
				default:
					actData.date = actData.date;
					actData.amount = this.currencyFormat(actData.amount);
					break;
			}
			return actData;
		},

		/**
		 * Function to return negative/possitive currency based on debit or credit criteria
		 * @function debitOrCreditCurrency
		 * @param {Boolean} [debitOrCredit] contain boolean
		 * @param {String} [amount] contain any string
		 * @memberOf module:dataTransform
		 **/
		debitOrCreditCurrency: function(debitOrCredit, amount) {
			return this.isDefined(debitOrCredit) && debitOrCredit ? this.currencyFormat(amount) : this.currencyFormat(amount * -1);
		},

		/**
		 * Function for validate whether  defined/undefined
		 * @function isDefined
		 * @param {String} [data] contain any string
		 * @memberOf module:dataTransform
		 **/
		isDefined: function(data) {
			if (typeof(data) === 'object') {
				return (data === null) ? false : (Object.getOwnPropertyNames(data).length !== 0);
			}
			return (data === undefined || data === null || data === '') ? false : true;
		},

		/**
		 * Function for convert a currency with separator with $ sign
		 * @function currencyFormat
		 * @param {String} [amount] currency
		 * @function convertToDollarDecimal() will return the currency with separator
		 * @memberOf module:dataTransform
		 **/
		currencyFormat: function(amount) {
			if (amount < 0) {
				formattedCurrency = '-' + currency + this.convertToDollarDecimal(amount * -1);
			} else {
				formattedCurrency = currency + this.convertToDollarDecimal(amount);
			}
			return formattedCurrency;
		},

		/**
		 * Function to format the account mask as (...1234)
		 * @function formatAccountMask
		 * @param {String} [mask] account mask
		 * @memberOf module:dataTransform
		 **/
		formatAccountMask: function(mask) {
			return mask.indexOf('(') !== -1 ? mask.replace('x', '...') : '(' + mask.replace('x', '...') + ')';
		},

		/**
		 * Function for convert a currency with separator
		 * @function convertToDollarDecimal
		 * @param {String} [amount] currency
		 * @memberOf module:dataTransform
		 **/
		convertToDollarDecimal: function(amount) {
			return parseFloat(Math.abs(amount), 10).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
		},

		/**
		 * Function for convert a as-of-date for summary with time and time zone
		 * @function asOfDateWithHrs
		 * @param {String} [accDate] date
		 * @memberOf module:dataTransform
		 **/
		asOfDateWithHrs: function(accDate) {
			var hrs, splitedDate, currentDate = new Date(accDate);
			hrs = currentDate.getHours();
			splitedDate = (currentDate + '').split(' ');
			hrs = hrs < 12 ? hrs + 'AM ' : hrs === 12 ? hrs + 'PM ' : hrs - 12 + 'PM ';
			return (hrs + (splitedDate.pop().replace(/\(|\)/g, '')) + ', ' + this.convertDate(accDate));
		},

		/**
		 * Function for convert a as-of-date for summary with Month name and date, year
		 * @function asOfDateWithMM
		 * @param {String} [accDate] date
		 * @memberOf module:dataTransform
		 **/
		asOfDateWithMM: function(accDate) {
			var accMonth;
			accDate = new Date(accDate);
			accMonth = accDate.getMonth() + 1;
			accMonth = accMonth < 10 ? '0' + accMonth : accMonth;
			return this.splitMMDDYYYY((accDate.getFullYear()) + '' + accMonth + '' + accDate.getDate());
		},

		asOfDateFullYear: function(asOfDate) {
			var asOfDate = new Date(asOfDate);
			return asOfDate.getFullYear();
		},

		/**
		 * Function for convert date from string to date with '/' separator MM/DD/YYYY
		 * @function splitMMDDYYYY
		 * @param {String} [aDate] date
		 * @memberOf module:dataTransform
		 **/
		splitMMDDYYYY: function(aDate) {
			if (aDate.length === 8) {
				return this.languageMapper.getLocaleMessage('MONTH')[aDate.substr(4, 2)] + ' ' + Number(aDate.substr(6, 2)) + ', ' + aDate.substr(0, 4);
			}
			return aDate.substr(5, 2) + '/' + aDate.substr(2, 2) + '/' + aDate.substr(0, 4);
		},

		//TODO: Below function is a hack.  Need to remove later. DPS layer should validate the data and should not send as '00000000'
		isValidDate: function(aDate) {
			return (aDate.length === 8 && (aDate.substr(4, 2) != '00' || aDate.substr(6, 2) != '00' || aDate.substr(0, 4) != '0000'));
		},

		/**
		 * Function for convert a date format with MM/DD/YYYY
		 * @function convertDate
		 * @param {String} [currentDate] date
		 * @memberOf module:dataTransform
		 **/
		convertDate: function(currentDate) {
			if (currentDate.length === 8) {
				return currentDate.substr(4, 2) + '/' + currentDate.substr(6, 2) + '/' + currentDate.substr(0, 4);
			}
			currentDate = new Date(currentDate);
			return ((currentDate.getMonth() + 1) + '/' + currentDate.getDate() + '/' + currentDate.getFullYear());
		},

		/**
		 * Function for add lead value based on acc type
		 * @function getLeadValue
		 * @param {Object} [accData] contain any object
		 * @memberOf module:dataTransform
		 **/
		getLeadValue: function(accData) {
			var lead_value = null,
				accountType = accData.summaryType,
				detailType = accData.detailType;

			switch (accountType) {
				case 'DDA':
					lead_value = this.isDefined(accData.summary.availableBalance) ? this.currencyFormat(accData.summary.availableBalance) : defaultNull;
					break;
				case 'CARD':
					lead_value = this.isDefined(accData.summary.currentBalance) ? this.currencyFormat(accData.summary.currentBalance) : defaultNull;
					break;
				case 'AUTOLOAN':
					lead_value = this.isDefined(accData.summary.currentBalance) ? this.currencyFormat(accData.summary.currentBalance) : defaultNull;
					break;
				case 'AUTOLEASE':
					lead_value = this.isDefined(accData.summary.nextPaymentAmount) ? this.currencyFormat(accData.summary.nextPaymentAmount) : defaultNull;
					break;
				case 'LOAN':
					if (detailType == 'HEO') {
						lead_value = this.isDefined(accData.summary.nextPaymentAmount) ? this.currencyFormat(accData.summary.nextPaymentAmount) : defaultNull;
					} else {
						lead_value = this.isDefined(accData.summary.currentBalance) ? this.currencyFormat(accData.summary.currentBalance) : defaultNull;
					}
					break;
				case 'MORTGAGE':
					lead_value = this.isDefined(accData.summary.nextPaymentAmount) ? this.currencyFormat(accData.summary.nextPaymentAmount) : defaultNull;
					break;
				case 'INVESTMENT':
					accData.linkTo = settings.get('classicInvestmentUrl') + accData.accountId;
					lead_value = (accData.summary.accountValue) ? this.currencyFormat(accData.summary.accountValue) : defaultNull; //TODO ; To be changed to Account Value
					break;
				default:
					lead_value = (accData.summary.availableBalance) ? this.currencyFormat(accData.summary.availableBalance) : defaultNull;
					break;
			}
			if (!this.isDefined(lead_value)) {
				accData.summary = null;
			}
			return lead_value;
		},

		/**
		 * Function for cloning object
		 * @function objectClone
		 * @param {Object} [objectVal] contain any object
		 * @memberOf module:dataTransform
		 **/
		objectClone: function(objectVal) {
			return JSON.parse(JSON.stringify(objectVal));
		},

		/**
		 * Function to search the table data
		 * @function searchTable
		 * @param {String} [selector] jquery selector
		 * @param {String} [searchTerm] search term
		 * @memberOf module:dataTransform
		 **/
		// searchTable: function(selector, searchTerm) {
		//     // hide all rows
		//     this.isDefined(searchTerm) ? this.$(selector + ' tr').hide() : this.$(selector + ' tr').show();
		//     var isFound = true;
		//     this.$('#no-record').empty();
		//     // for each row containing searchTerm collect the "data-date" attribute value
		//     $('tr:Contains(' + searchTerm + ')').each(function() {
		//         if ($(this).data('searchKey') !== undefined) {
		//             isFound = false;
		//             $('tr[data-heading=' + $(this).data('listHead') + ']').show();
		//             $('tr[data-search-key=' + $(this).data('searchKey') + ']').show();
		//         }
		//     });

		//     //  No Match
		//     if (false) {
		//         this.$(selector + ' thead tr').hide();
		//         this.$('#no-record').html(' No Records Found');
		//     }
		// },

		//To do: Temporary work around for case insensitive search
		// $.expr[':'].Contains: function(a, i, m) {
		//     return jQuery(a).text().toUpperCase()
		//         .indexOf(m[3].toUpperCase()) >= 0;
		// },

		// activeSummary: function(activeAccountId, requestedAccountId, data) {
		//     //TODO: Change using messaging and setting model
		//     Object.keys(data).forEach(function() {
		//         if (data.accountId === activeAccountId) {
		//             data.active = false;
		//         }
		//         if (data.accountId === requestedAccountId) {
		//             data.active = true;
		//         }
		//     });
		//     return data;
		// },

		//ToDo: Service call with ajax
		// mockService: function(url) {
		//     var promise = jQuery.Deferred();
		//     http.request(url).then(promise.resolve, promise.reject);
		//     return promise.promise();
		// },

		//Helper functions for summary component to function in asscociation with the new Blue component spec
		prepareSummaryData: function(account) {
			var accountTileData = {};

			accountTileData.accountNumber = account.accountId;
			accountTileData.accountType = account.summaryType;
			accountTileData.detailType = account.detailType;
			accountTileData.accountName = this.isDefined(account.nickname) ? account.nickname : defaultNull;
			accountTileData.accountMaskNumber = this.formatAccountMask(account.mask);
			accountTileData.accountBalance = account.lead_value ? account.lead_value : defaultNull;
			accountTileData.accountClosedInd = this.isDefined(account.summary) && this.isDefined(account.summary.closed) && account.summary.closed ? true : false;

			switch (account.summaryType) {
				case 'MORTGAGE':
				case 'LOAN':
					accountTileData.nextPaymentDueAmount = account.lead_value ? account.lead_value : defaultNull;
					accountTileData.accountCurrentBalance = account.lead_value ? account.lead_value : defaultNull;
					break;
				case 'CARD':
					accountTileData.accountCurrentBalance = account.lead_value ? account.lead_value : defaultNull;
					break;
				default:
					accountTileData.accountBalance = account.lead_value ? account.lead_value : defaultNull;
					break;
			}

			return accountTileData;
		},

		getTitleCase: function(str) {
			return str.replace(/\w\S*/g, function(txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});
		},

		/**
		 * Function to Format the State in Address
		 * @function stateFormatter
		 * @memberOf module:dataTransform
		 **/

		stateFormatter: function(state) {
			if (state.length === 2) {
				return state.toUpperCase();
			}
			return state.toLowerCase().replace(/(?:^|\s)\S/g, function(a) {
				return a.toUpperCase();
			});
		},


		checkAccountTypeSupport: function(accountType) {
			var supportedAccountTypes = ['DDA', 'CARD', 'AUTOLEASE', 'MORTGAGE', 'AUTOLOAN', 'INVESTMENT', 'LOAN'];
			return (supportedAccountTypes.indexOf(accountType) === -1) ? true : false;
		},

		// getComponentInstance: function(context, componentType, dataModel, params, itemInstanceName) {
		//     return new context.accountsComponentInstance[componentType](itemInstanceName, dataModel, params);
		// },

		// createSummaryAccountComponent: function(context, account) {
		//     //construct instance name
		//     var observable = require('blue/observable');
		//     var itemInstanceName = account.accountId;
		//     var processedSummaryData = this.prepareSummaryData(account);
		//     var dataModel = observable.Model(processedSummaryData);
		//     var itemInstance = this.getComponentInstance(context,
		//         account.summaryType,
		//         dataModel, {
		//             context: context
		//         }, itemInstanceName
		//     );

		//     itemInstance = context.register();

		//     //update model
		//     context.model.lens(itemInstanceName).set(processedSummaryData);
		//     this.register.components(context, [{
		//         name: itemInstanceName,
		//         model: processedSummaryData,
		//         spec: context.accountsSpec[account.summaryType],
		//         methods: context.accountsComponentInstance[account.summaryType]
		//     }]);

		//     //map component actions to this controller
		//     // this.associateReceivers(itemInstance, context, itemInstanceName, account.summaryType, context.accountsSpec);

		//     //record the created instance in controller members to access
		//     //context.components[itemInstanceName] = itemInstance;

		//     //return created info for controller to do some processing
		//     return {
		//         itemInstanceName: itemInstanceName
		//     };
		// },

		showOverlay: function() {
			$('.overlay, #pre-loader').show();
		},

		//Todo: Check profile refresh service call for accounts
		isProfileRefresh: function(account) {
			var result = false;
			if (account.unavailable === false && !this.isDefined(account.summary)) {
				result = true;
			} else {
				switch (account.summaryType) {
					case 'LOAN':
						if (account.detailType==='HEO'){
							if (this.isDefined(account.summary) && !this.isDefined(account.summary.nextPaymentAmount)) {
							result = true;
							}
						}
						else {
							if (this.isDefined(account.summary) && (!this.isDefined(account.summary.currentBalance))) {
							result = true;
							}
						}
						break;
					case 'MORTGAGE':
						if (this.isDefined(account.summary) && !this.isDefined(account.summary.nextPaymentAmount)) {
							result = true;
						}
						break;
					default:
						if (this.isDefined(account.summary) && (!this.isDefined(account.summary.currentBalance) || !this.isDefined(account.summary.availableBalance))) {
							result = true;
						}
						break;
				}
			}
			return result;
		},


		//Todo: Check number of accounts to set model data
		// isRefreshSetReady: function(count, total, isBalanceData) {
		//     var maxCount = this.getAccountsMessage('SET_REFRESH_DATA_COUNT');
		//     if ((count % maxCount === 0 || total === count) && isBalanceData === true) {
		//         return true;
		//     }
		//     return false;
		// },

		//Todo: Replace new refresh call data to accounts data
		replaceLatestData: function(summaryData) {

			var lead_value = this.isDefined(summaryData.summary) ? this.getLeadValue(summaryData) : defaultNull,
				result = {};

			result.accountBalance = lead_value ? lead_value : defaultNull;
			result.lastUpdatedAt = (this.isDefined(summaryData.summary) && this.isDefined(summaryData.summary.asOf)) ? this.asOfDateWithHrs(summaryData.summary.asOf) : defaultNull;
			result.accountClosedInd = (this.isDefined(summaryData.summary) && this.isDefined(summaryData.summary.closed) && summaryData.summary.closed) ? true : false;

			return result;
		}

		//Todo: Check number of accounts to set model data
		// isRefreshSetReady: function(currentData, oldData) {
		//     if (currentData.accountBalance !== oldData.accountBalance || currentData.lastUpdatedAt !== oldData.lastUpdatedAt) {
		//         return true;
		//     }
		//     return false;
		// }
	};
});
