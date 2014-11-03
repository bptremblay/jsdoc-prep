/*  ======== paymentBill Component ========== */
define(function() {
	var context = null,
		validate = null;
	return {
		init: function() {
			context = this.settings.context;
			validate = this.settings.validate;
		},
        //action to call Payee List service on PayBill landing page to load payees dropdown
        loadPayeeList: function(payeeId) {
            var serviceData = {
                pageId: this.pageId ? this.pageId : '1'
            };
            //Call Payee list service to get the list of merchant payees
            context.singlePaymentServices.singlePayment.singlePaymentPayeeList(serviceData).then(
                function(data) {
                    data.entryData = serviceData;
                    data.payeeId = payeeId;
                    context.controllerChannel.emit('setSinglePaymentPayeeList', data);
                }.bind(this),
                function(jqXHR) {
                    context.logger.info('jqXHR : ', jqXHR);
                }.bind(this)
            );
        },
        //action to call Payment options List service on PayBill landing page to load funding acnts dropdown
		initiateMerchantBillPayment: function(pId) {
			var selectPayeeData = {
    			payeeId: pId
    		};
			context.componentChannel.emit('payeeSelectCommonHandler', selectPayeeData);
		},
		//load the funding account list
		loadAccountsAndActivity: function(pId) {
			var serviceData = {
            	payeeId: pId ? pId : ''
            };

            if(pId !== '') {
            	// emit this signal to load Payee Activity Controller
            	var activityParams = {
            		payeeId: pId ? pId : '',
            		payeeName: this.payeeNameValue ? this.payeeNameValue : ''
            	};
	            context.componentChannel.emit('loadPayeeActivity', activityParams);
                //Call service to get the list of payment options including funding accounts based on selected merchant payee
	            context.singlePaymentServices.singlePayment.singlePaymentOptionsList(serviceData).then(
	            	function(data) {
	            		var model = context.model.lens('singlePaymentEntryComponent').get();
	            		data.entryData = serviceData;
            			// Emit state to SinglepaymentEnter view to render fundingAcounts Drop down
	            		this.output.emit('state', {
		                    target: this,
		                    value: 'setPaymentOptions',
		                    listData: data.fundingAccounts,
		                    cueText: model.funding_account_display_name_with_balance_placeholder
		                });
		            	// Emit this Singal to the controller to keep the fundingaccounts drop down data in the model
	            		context.controllerChannel.emit('setFundingAccounts', data);
		            }.bind(this),
	                function(jqXHR) {
	                    context.logger.info('jqXHR : ', jqXHR);
	                }.bind(this)
	            );
        	}
		},
        //action to call Add Single Payment service on PayBill verify step to submit payment
		confirmMerchantBillPayment: function() {
			//send a message to payeeActivity controller to hide any confirm messages.
			context.componentChannel.emit('hideAllEditTransaction');
            var verifyReqData = {
            	formId: this.formId ? this.formId : ''
            };
            //Call service to add payment for merchant payee
            context.singlePaymentServices.singlePayment.singlePaymentConfirm(verifyReqData).then(
            	function(data) {
            		context.controllerChannel.emit('setSinglePaymentConfirm', data);
	            }.bind(this),
                function(jqXHR) {
                    context.logger.info('jqXHR : ', jqXHR);
                }.bind(this)
            );
		},
        //action to call Verify Single Payment service on PayBill page to verify payment
		verifyMerchantBillPayment: function() {
			//send a message to payeeActivity controller to hide any confirm messages.
			context.componentChannel.emit('hideAllEditTransaction');
			//TODO - Create utility function to format dates
            //format input date returned via component in 'yyyy-mm-dd' format so as to send to service in 'mm/dd/yyyy' format
            var sendPaymentOnDate = new Date(this.transactionDueDate);
            var spYear = sendPaymentOnDate.getFullYear();
            var spMonth = (1 + sendPaymentOnDate.getMonth()).toString();
            spMonth = spMonth.length > 1 ? spMonth : '0' + spMonth;
            var spDay = (1 + sendPaymentOnDate.getDate()).toString();
            spDay = spDay.length > 1 ? spDay : '0' + spDay;
            var sendPaymentOnRequestDate = spMonth + '/' + spDay + '/' + spYear;

            //create request params for service to validate payment
			var serviceRequestData = {
            	payeeId: this.payeeName ? this.payeeName : '',
                amount: this.transactionAmount ? this.transactionAmount: '',
                dueDate: sendPaymentOnRequestDate ? sendPaymentOnRequestDate: '',
                fundingAccountId: this.fundingAccountDisplayNameWithBalance ? this.fundingAccountDisplayNameWithBalance : '',
                memo: this.memo ? this.memo : ''
            };
            //create request params to store and use on click of Previous on Verify step
            var enterRequestData = {
            	payeeId: this.payeeName ? this.payeeName : '',
                amount: this.transactionAmount ? this.transactionAmount: '',
                processDate: this.transactionInitiationDate ? this.transactionInitiationDate: '',
                dueDate: this.transactionDueDate ? this.transactionDueDate: '',
                fundingAccountId: this.fundingAccountDisplayNameWithBalance ? this.fundingAccountDisplayNameWithBalance : '',
                memo: this.memo ? this.memo : ''
            };
            //Call service to validate payment for selected merchant payee
            context.singlePaymentServices.singlePayment.singlePaymentVerify(serviceRequestData).then(
            	function(data) {
            		data.entryData = enterRequestData;
            		context.controllerChannel.emit('setSinglePaymentVerify', data);
	            }.bind(this),
                function(jqXHR) {
                    context.logger.info('jqXHR : ', jqXHR);
                }.bind(this)
            );
		},
        //action to go back to Entry step on click of Previous on Verify step
		cancelMerchantBillPayment: function() {
			//send a message to payeeActivity controller to hide any confirm messages.
			context.componentChannel.emit('hideAllEditTransaction');
			context.controllerChannel.emit('setSinglePaymentEntry');
		},
        //action to exit or cancel the flow
		exitMerchantBillPayment: function() {
			context.controllerChannel.emit('setSinglePaymentExit');
		},
		requestPayeeActivity: function() {

		}
	};
});
