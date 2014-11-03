define(function() {
	var context = null,
	validate = null;

	return {
		init: function() {
			context = this.settings.context;
			validate = this.settings.validate;
		},
		/**
		 * Function for handling the display of payee activity
		 * @function showTransactions
		 * @memberOf module:PayeeActivityComponent
		 */
		 showTransactions: function(data) {
		 	//TODO : Milan - Try to break functions into smaller pices for reducing compexity and improve maintainabilty
		 	var more = true;
			//TODO: Kaushik - Needs refactoring
			// this means it is a new request because data has payee id as an input
			// if payee id is not passed that means the request is for See more transactions

			if (data !== undefined && data.payeeId !== undefined) {
				this.payeeId = data.payeeId;
				if(data.payeeName) {
					this.payeeName = data.payeeName;
				}
				else {
					this.payeeName = '';
				}
				more = false;
			}

			// Setup Service request data
			var serviceData = {
				payeeId: this.payeeId,
				more: more
			};

			//Call service to get the list of payments
			context.payeeActivityServices.payeeActivity.payeeActivityList(serviceData).then(
				function(responseData) {
					responseData.payeeId = this.payeeId;
                	//Dynamically update the link
                	context.dynamicContentUtil.dynamicContent.set(this, 'payee_activity_legal', {link:'href="#"'});
                	// TODO: Kaushik - Payee Name is not returned by service anymore Needs refactoring.

//TODO: try to merge if conditions
                	if (responseData.merchantPayments) {
                		if (responseData.merchantPayments.length > 0) {
                			var tmpList = []; // use temp array for
                			this.additionalTransactionActivity = responseData.more;
                			for (var i = 0; i < responseData.merchantPayments.length; i++)
                			{
                				var element = responseData.merchantPayments[i];
                				var item =  {
                					transactionInitiationDate: element.processDate,
                					transactionDueDate: element.dueDate,
                					transactionStatus: context.dynamicContentUtil.dynamicSettings.get(this, 'transaction_status', element.paymentStatus.trim().toLowerCase()),
                					transactionAmount: '$' + element.amount,
                					updateAllowed : element.updateAllowed,
                					cancelAllowed : element.cancelAllowed,
                					inquiryAllowed : element.inquiryAllowed,
                					paymentId : element.paymentId,
                					showDetails: false,
                					showEdit: false,
                					showSuccessConfirmation: false,
                					transactionStatusDetail : '',
                					fundingAccountDisplayName: '',
                					memo: '',
                					submittedBy: '',
                					updatedBy: '',
                					approvedBy: '',
                					transactionNumber: ''
                				};
                				// TODO: use temp array and reassig
                				tmpList.push(item);
                			}

                			this.payeeActivityTransactions = tmpList;// add the object in the list so that Ractive can populate in the DOM
                		}
                	}
                	else {
                		this.payeeActivityTransactions = [];
                		// Setting empty values if there are no records found.
                		this.additionalTransactionActivity = false;
                	}
                	if (!this.viewRendered) {// check if first call; i.e. executeCAV completed. if not the call signal which should execute CAV.

                		context.controllerChannel.emit('displayPayeeActivity', data);      
                		this.viewRendered = true;
                	}

                }.bind(this),
                function(jqXHR) {
                	context.logger.info('jqXHR : ', jqXHR);
                }.bind(this)
                );

		},

		/*
		 * @Desc : is called when user clicks on hide details
		 * @function hideTransactionDetails
		 * @memberOf module: PayeeActivityComponent
		 */
		 hideTransactionDetails: function(input) {
		 	this.hideAllEditTransaction();
		 	input.context.showDetails = false;
		 },

		/*
		 * @Desc : is called when user clicks on see details
		 * @function requestTransactionDetails
		 * @memberOf module: PayeeActivityComponent
		 */
		 requestTransactionDetails: function(input) {
		 	this.hideAllEditTransaction();
			var transactionRow = input.context; // points to the row object where user clicked on see details
			var verifyReqData = {
				'paymentId': transactionRow.paymentId
			};
			context.payeeActivityServices.payeeActivity.payeeActivityDetail(verifyReqData).then(
				function(data) {
					this.hideAllTransactionDetails(input);
					transactionRow.showDetails = true;
					transactionRow.transactionStatusDetail = context.dynamicContentUtil.dynamicSettings.get(this, 'transaction_status_detail', data.paymentStatus.trim().toLowerCase());
					transactionRow.fundingAccountDisplayName = data.fundingAccountName;
					transactionRow.memo =   this.sanitize(data.memo,'none_label');
					transactionRow.submittedBy = this.sanitize(data.submittedBy,'not_available_label');
					transactionRow.updatedBy = this.sanitize(data.lastModifiedBy,'not_available_label');
					transactionRow.approvedBy = this.sanitize(data.approvedBy,'not_available_label');
					transactionRow.transactionNumber = data.paymentId;
				}.bind(this),
				function(jqXHR) {
					context.logger.info('jqXHR : ', jqXHR);
				}.bind(this)
				);
		},

		/*
		 * @Desc : is called when user clicks on edit and show the edit list
		 * @function updateTransaction
		 * @memberOf module: EditTransactionComponent
		 */
		updateTransaction: function(input) {
			//hide show details is visiable
			var currentTranscationRow = input.dataPath.split('.')[1];

			var payLoadData = {
				'paymentId': input.context.paymentId,
				'currentTranscationRow':  currentTranscationRow,
				'event' : input
			};
			this.hideAllEditTransaction();// to ensure closing any open edit block
			this.hideAllTransactionDetails(input);
			input.context.showEdit = true;


			context.controllerChannel.emit('editPayeeTransaction', payLoadData);
		},

		/*
		 * @Desc : is called when user clicks cancel
		 * @function cancelTransaction
		 * @memberOf module: EditTransactionComponent
		 */
		cancelTransaction: function(input) {
			this.hideAllTransactionDetails(input);//Hide any open sections in the row
			this.hideAllEditTransaction();//remove all edit transaction and message.
			var currentTranscationRowNum = input.dataPath.split('.')[1];
			var transactionRow = input.context; // points to the row object where user clicked on cancel
			var cancelListReqData = {
				'paymentId': transactionRow.paymentId
			};

			context.payeeActivityServices.payeeActivity.merchantPaymentCancelList(cancelListReqData).then(
				function(data) {
					//
					var cancelDataResp = {
						'payeeName': this.payeeName,
						'transactionNotificationDate': data.paymentProcessDate,
						'cancellationToken': data.cancellationToken,
						'transactionAmount': data.amount,
						'paymentId': data.paymentId,
						'currentTranscationRowNum': currentTranscationRowNum
					};

					context.controllerChannel.emit('showCancelPaymentConfirmation',{'cancelData': cancelDataResp});
				}.bind(this),
				function(jqXHR) {
					context.logger.info('jqXHR : ', jqXHR);
				}.bind(this)
			);
		},

		/*
		 * @Desc : is called to hide transaction details if its opened.
		 * @function hideAllTransactionDetails
		 * @memberOf module: EditTransactionComponent
		 */
		hideAllTransactionDetails: function(input) {
			input.context.showDetails = false;
			input.context.showEdit = false;
			input.context.showSuccessConfirmation = false;
		},

		/*
		 * @Desc : is called to hide all edit box.
		 * @function hideAllEditTransaction
		 * @memberOf module: EditTransactionComponent
		 */
		hideAllEditTransaction: function(){
			for(var i=0; i < this.payeeActivityTransactions.length; i++) {
				this.payeeActivityTransactions[i].showEdit = false;
				this.payeeActivityTransactions[i].showSuccessConfirmation = false;
			}
		},

		/*
		 * @Desc : is called to hide the current edit transaction box.
		 * @function hideEditTransaction
		 * @memberOf module: EditTransactionComponent
		 */
		hideEditTransaction: function(transactionRowDetail){
			this.payeeActivityTransactions[transactionRowDetail.transactionRow].showEdit = false;
			this.payeeActivityTransactions[transactionRowDetail.transactionRow].showSuccessConfirmation = false;

		},

		/*
		 * @Desc : A generic function to be called to update the transaction row's detail.
		 * @function showUpdateSuccessConfirmation
		 * @memberOf module: EditTransactionComponent
		 */
		showUpdateSuccessConfirmation: function(inputData){
			if (inputData.action === 'EDIT') {
				this.payeeActivityTransactions[inputData.transactionRowNum].transactionAmount = inputData.transactionDetail.transactionAmount ? '$' +inputData.transactionDetail.transactionAmount : '';
				this.payeeActivityTransactions[inputData.transactionRowNum].transactionDueDate = inputData.transactionDetail.transactionDueDate ? inputData.transactionDetail.transactionDueDate : '';
				this.payeeActivityTransactions[inputData.transactionRowNum].transactionInitiationDate = inputData.transactionDetail.transactionInitiationDate ? inputData.transactionDetail.transactionInitiationDate : '';
				this.payeeActivityTransactions[inputData.transactionRowNum].transactionStatus =  context.dynamicContentUtil.dynamicSettings.get(this, 'transaction_status', inputData.transactionDetail.transactionStatus.trim().toLowerCase());
				this.payeeActivityTransactions[inputData.transactionRowNum].updateAllowed = inputData.transactionDetail.updateAllowed ? inputData.transactionDetail.updateAllowed : false;
				this.payeeActivityTransactions[inputData.transactionRowNum].displayMessage = context.dynamicContentUtil.dynamicContent.get(this, 'update_merchant_bill_payment_confirmation_message', {payee:this.payeeName});
			}
			else if (inputData.action === 'CANCEL') { //cancel
        		this.payeeActivityTransactions[inputData.transactionRowNum].transactionInitiationDate = inputData.transactionDetail.transactionInitiationDate ? inputData.transactionDetail.transactionInitiationDate : '';
				this.payeeActivityTransactions[inputData.transactionRowNum].transactionDueDate =  inputData.transactionDetail.transactionDueDate ? inputData.transactionDetail.transactionDueDate : '';
				this.payeeActivityTransactions[inputData.transactionRowNum].transactionStatus =  context.dynamicContentUtil.dynamicSettings.get(this, 'transaction_status', inputData.transactionDetail.transactionStatus.trim().toLowerCase());
				this.payeeActivityTransactions[inputData.transactionRowNum].transactionAmount =  inputData.transactionDetail.transactionAmount ? '$' +inputData.transactionDetail.transactionAmount : '';
				this.payeeActivityTransactions[inputData.transactionRowNum].updateAllowed = inputData.transactionDetail.updateAllowed ? inputData.transactionDetail.updateAllowed : false;
				this.payeeActivityTransactions[inputData.transactionRowNum].cancelAllowed = inputData.transactionDetail.cancelAllowed ? inputData.transactionDetail.cancelAllowed : false;
				this.payeeActivityTransactions[inputData.transactionRowNum].inquiryAllowed = inputData.transactionDetail.inquiryAllowed ? inputData.transactionDetail.inquiryAllowed : false;
				this.payeeActivityTransactions[inputData.transactionRowNum].displayMessage = context.dynamicContentUtil.dynamicContent.get(this, 'cancel_merchant_bill_payment_confirmation_message', {amount:inputData.transactionDetail.transactionAmount ? inputData.transactionDetail.transactionAmount : '',payee:this.payeeName});
			}

			this.payeeActivityTransactions[inputData.transactionRowNum].showSuccessConfirmation = true;

		},

// TODO:  by MILAN for Team :  do we need to move this functions to common?
		/*
		 * @Desc : Pulls value for the key from resource bundle.
		 * @function getValueFromResource
		 * @Param 1:  Key for which content has to be pulled from resource file
		 * @memberOf module: PayeeActivityComponent
		 */
		 getValueFromResource: function (key) {
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
		 * @memberOf module:PayeeActivityComponent :
		 */
		sanitize: function(str, newStrResourceKey) {
			var ret = str;
			if (!str || str === '') {
 				ret = newStrResourceKey?this.getValueFromResource(newStrResourceKey) : '';
			}
			return  (ret!==undefined)?ret:newStrResourceKey ;
		}


		};
	});
