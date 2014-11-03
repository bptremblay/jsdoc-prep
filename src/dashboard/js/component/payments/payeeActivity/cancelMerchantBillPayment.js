define(function(require) {
	var context = null;
	return {
		init: function() {
			context = this.settings.context;
 		},

		/**
		 * user clicks "keept it" and dont make any changes
		 * @function doNotCancelMerchantBillPayment
		 * @memberOf module:CancelMerchantBillPayment Component
		 */
		doNotCancelMerchantBillPayment: function() {
			// Hide the modal without making any service call
			context.controllerChannel.emit('hideCancelPaymentConfirmation');
		},


		/**
		 * Function for cancelling the payment
		 * @function confirmCancelMerchantBillPayment
		 * @memberOf module:CancelMerchantBillPayment Component
		 */
		confirmCancelMerchantBillPayment: function(payLoad) {
		// Make a CANCEL service call and then emit signal to PayeeActivty which can display sucess message
			var cancelReqData = {
						'paymentId': this.paymentId,
						'cancellationToken': this.cancellationToken,
						'memo': this.memo
					};
					context.payeeActivityServices.payeeActivity.merchantPaymentCancel(cancelReqData).then(
						function(responseData) {
							var paramData = {
								'action': 'CANCEL',
								'transactionRowNum': this.currentTranscationRowNum,
								'transactionDetail': {
									'transactionAmount': responseData.amount,
									'transactionInitiationDate':responseData.paymentProcessDate,
								// TODO :  send The below properties as recieved from service once service starts sending them.
									'transactionDueDate': '',
									'transactionStatus':'canceled',
									'updateAllowed' : false,
	                				'cancelAllowed' : false,
	                				'inquiryAllowed' : false
								}
							};
 							//Show cancellation sucess message to user
 							context.controllerChannel.emit('updateTransactionWithMessage',paramData);
 							//Hide the cancel layer
							context.controllerChannel.emit('hideCancelPaymentConfirmation');
						}.bind(this),
						function(jqXHR) {
							context.logger.info("jqXHR : ", jqXHR);
						}.bind(this)
					);
		},
		/**
         * @function setFocus
         * @description Sets focus on passed element
         * @param {String} item Name of the item to get the focus
         * @returns {none}
         */
        setFocus: function(item){
        	this.output.emit('state',{
        		value: 'setFocus',
        		element: item
        	});
        }
	}
});
