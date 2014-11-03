/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module editTanscation Component
 */
define(function() {
	var context = null,
		validate = null;

	return {
		init: function() {
			context = this.settings.context;
			validate = this.settings.validate;
		},

		/**
		 * Function for handling the display of edit list and service call.
		 * @function showMerchantBillPayment
		 * @memberOf module:EditTransactionComponent
		 */
		showMerchantBillPayment: function(data){
						// Setup Service request data
			var serviceData = {
				'paymentId': data.paymentId
			};

			var paramData = {
				'paymentId': data.paymentId,
				'currentTranscationRow' : data.currentTranscationRow
			};

			this.model.lens('currentTranscationRowNum').set(data.currentTranscationRow);
			this.model.lens('currentTranscationId').set(data.paymentId);
			//Call service to get edit transaction
			context.payeeActivityServices.payeeActivity.editTransactionList(serviceData).then(
				function(responseData) {

					this.fundingAccountList = [];
					if (responseData.fundingAccounts) {
						for (var i = 0; i < responseData.fundingAccounts.length; i++) {
							var item = {
								value: responseData.fundingAccounts[i].accountId,
								//TODO: @Jin Server should concatenate the account and balance when they response.
								label: responseData.fundingAccounts[i].accountName + ' $' + responseData.fundingAccounts[i].availableBalance,
							};
							this.fundingAccountList.push(item);

						}
					}
					this.fundingAccountDisplayNameWithBalance = responseData.fundingAccountId;
					this.memo = this.sanitize(responseData.memo);
					this.paymentMethodCutoffTime = this.sanitize(responseData.cutOffTime);
					this.transactionAmount = this.sanitize(responseData.amount);
					this.transactionNotificationDate = this.sanitize(responseData.processDate);
					this.transactionDueDate = this.sanitize(responseData.dueDate);
					this.optionId = responseData.optionId;
					this.updateToken = responseData.updateToken;
					this.paymentId = this.sanitize(paramData.paymentId);
					this.payeeName = this.sanitize(responseData.payeeName);
					this.model.lens('fundingAccountList').set(this.fundingAccountList);
					this.model.lens('showEditTransaction').set(true);
					this.model.lens('paymentId').set(this.paymentId);
					this.model.lens('disableOverlayInEditList').set(false);
					context.controllerChannel.emit('displayEditPayeeTransaction',paramData);
				}.bind(this),
				function(jqXHR) {
					context.logger.info('jqXHR : ', jqXHR);
				}.bind(this)
			);
		},

		/**
		 * Function for going back to edit list.
		 * @function initiateUpdateMerchantBillPayment
		 * @memberOf module:EditTransactionComponent
		 */
		initiateUpdateMerchantBillPayment: function(data) {
			data.context.disableOverlayInEditList = true;
			this.fundingAccountDisplayNameWithBalance = this.prevFundingAccountDisplayNameWithBalance;
			this.memo = this.prevMemo;
			this.transactionAmount = this.transactionAmount.replace('$','');
			data.context.showEditTransaction = true;
		},



		/*
		 * @Desc : This will make service call to verify edit.
		 * @function verifyUpdateMerchantBillPayment
		 * @memberOf module: EditTransactionComponent
		 */
		verifyUpdateMerchantBillPayment: function(data) {
			var dueDate = this.convertDateToServiceFormat(this.transactionDueDate);

			var serviceData = {
				'paymentId': this.paymentId,
				'amount': this.transactionAmount,
				'dueDate': dueDate,
				'fundingAccountId': this.fundingAccountDisplayNameWithBalance,
				'memo': this.memo === '' || this.memo === undefined ? '' : this.memo,
				'optionId': this.optionId
			};

			context.payeeActivityServices.payeeActivity.editTransactionVerify(serviceData).then(
				function(responseData) {

					this.prevFundingAccountDisplayNameWithBalance = this.fundingAccountDisplayNameWithBalance;
					this.prevMemo = this.sanitize(this.memo);
					//TODO: @Jin Server needs to response balance
					this.fundingAccountDisplayNameWithBalance = responseData.accountName;
					this.memo = this.sanitize(responseData.memo,'none_label');
					this.transactionAmount = '$' + responseData.amount;
					this.transactionNotificationDate = responseData.processDate;
					this.transactionDueDate = responseData.dueDate;
					this.formId = responseData.formId;
					data.context.showEditTransaction = false;//we have to update the data in the row not component to update variable in ractive.

				}.bind(this),
				function(jqXHR) {
					context.logger.info('jqXHR : ', jqXHR);
				}.bind(this)
			);

		},

		/*
		 * @Desc : This will make service call for confirming edit
		 * @function confirmUpdateMerchantBillPayment
		 * @memberOf module: EditTransactionComponent
		 */
		confirmUpdateMerchantBillPayment: function() {

			var serviceData = {
				'formId': this.formId,
				'updateToken': this.updateToken
			};

			context.payeeActivityServices.payeeActivity.editTransactionConfirm(serviceData).then(
				function(responseData) {

					var currentTranscationRowNum = this.model.lens('currentTranscationRowNum').get();

					var paramData = {
						'action': 'EDIT',
						'transactionRowNum': currentTranscationRowNum,
						'transactionDetail': {
							'transactionAmount': responseData.amount,
							'transactionDueDate': responseData.dueDate,
							'transactionInitiationDate': responseData.processDate,
							'transactionStatus': responseData.status,
							'updateAllowed' : responseData.status.trim().toLowerCase() === 'funded' ? false : true
						}
					};

					context.controllerChannel.emit('hideEditTransaction',{'transactionRow' : currentTranscationRowNum});
					context.controllerChannel.emit('updateTransactionWithMessage',paramData);

				}.bind(this),
				function(jqXHR) {
					context.logger.info('jqXHR : ', jqXHR);
				}.bind(this)
			);

		},

		/*
		 * @Desc : This will hide the expanded edit blocks of a current row only
		 * @function hideEditTransaction
		 * @memberOf module: cancelUpdateMerchantBillPayment
		 */
		cancelUpdateMerchantBillPayment: function() {
			//var transactionRow = input.domEvent.currentTarget.value;
			var currentTranscationRowNum = this.model.lens('currentTranscationRowNum').get();
			context.controllerChannel.emit('hideEditTransaction',{'transactionRow' : currentTranscationRowNum});
 		},


// TODO:  by MILAN for Team :  do we need to move this functions to common?
		/*
		 * @Desc : Pulls value for the key from resource bundle.
		 * @function getValueFromResource
		 * @Param 1:  Key for which content has to be pulled from resource file
		 * @memberOf module: EditTransactionComponent
		 */
		getValueFromResource: function(key) {
			return this.model.lens(key).get();
		},

		/**
		 * @Desc :Function for sanitizing the Submitted by, Updated by& Approved by will replace null, empty string or Not Avaiable with a valid content from the resource bundle.
		 * @function sanitize
		 * @Param 1:  String to be checked for null/empty,
		 * @Param 2:  Replacement key of resource bundle file to be used;
		 * @Returns:  returns param1 as is if NOT empty/null/''
		 *			  but if empty/null/'' Then
		 *				- returns value from the resource bundle if found
		 *				- if param2 is not passed Then empty string '' would be reuturned;
		 *				- if the key is not found in bundle the key would be returned as is.
		 * @memberOf module:EditTransactionComponent :
		 */
		sanitize: function(str, newStrResourceKey) {
			var ret = str;
			if (!str || str === '') {
 				ret = newStrResourceKey?this.getValueFromResource(newStrResourceKey) : '';
			}
			return  (ret!==undefined)?ret:newStrResourceKey ;
		},

		/*
		 * @Desc : Converts the date format 'yyyy-mm-dd' to 'mm/dd/yyyy'.
		 * @function getValueFromResource
		 * @Param 1:  Key for which content has to be pulled from resource file
		 * @memberOf module: EditTransactionComponent
		 */
		convertDateToServiceFormat: function(date){
			var sendPaymentOnDate = new Date(date);
			var spYear = sendPaymentOnDate.getFullYear();
			var spMonth = (1 + sendPaymentOnDate.getMonth()).toString();
			spMonth = spMonth.length > 1 ? spMonth : '0' + spMonth;
			var spDay = (1 + sendPaymentOnDate.getDate()).toString();
			spDay = spDay.length > 1 ? spDay : '0' + spDay;
			var requestDate = spMonth + '/' + spDay + '/' + spYear;
			return requestDate;
		}

	};
});
