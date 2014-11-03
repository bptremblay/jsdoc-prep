/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module DataTransform
 */
//Todo: Functions that may pull in to framework later.
define(function() {
	return function SinglePaymentDataTransform() {

		this.getSPPayeeListDataModel = function(model, responseData) {
			var payeeList = [{'value': '', 'label': model.payee_name_placeholder, 'selected': true}];
			if(responseData.merchantPayees){
				for(var i=0; i<responseData.merchantPayees.length; i++ )
				{
					payeeList.push({'value':responseData.merchantPayees[i].payeeId,'label':responseData.merchantPayees[i].payeeName, 'selected':false});
				}
           	}
           	model.payeeList = payeeList;
			return model;
		};
		this.getSPPaymentOptionsDataModel = function(model, responseData) {
			var fundingAcntsList = [{'value': '', 'label': model.funding_account_display_name_with_balance_placeholder, 'selected': false}];
			var fundingAccountDisplayNameWithBalance = '';
			if(responseData.fundingAccounts){
				for(var i=0; i<responseData.fundingAccounts.length; i++ )
				{
					//TODO: @Jin Server should concatenate the account and balance when they response.
					var fundingAccountDisplayNameWithBalanceLabel = responseData.fundingAccounts[i].label + ' $' + responseData.fundingAccounts[i].availableBalance;
					fundingAcntsList.push({'value':responseData.fundingAccounts[i].id,'label':fundingAccountDisplayNameWithBalanceLabel,'selected':responseData.fundingAccounts[i].defaultAccount});
					// This is done to select a default funding account id.

					fundingAccountDisplayNameWithBalance = responseData.fundingAccounts[i].defaultAccount ? responseData.fundingAccounts[i].id : fundingAccountDisplayNameWithBalance;
				}
           	}
           	model.fundingAccountDisplayNameWithBalance = fundingAccountDisplayNameWithBalance;
           	model.fundingAcntsList = fundingAcntsList;
			return model;
		};
		// Populate Entry data model on click of Previous button
		this.getSPEnterDataModel = function(model, responseData) {
           	if(responseData){
				model.payeeName = responseData.payeeId;
				model.fundingAccountDisplayNameWithBalance = responseData.fundingAccountId;
				model.transactionAmount = responseData.amount;
				model.transactionInitiationDate = responseData.processDate;
				model.transactionDueDate = responseData.dueDate;
				model.memo = responseData.memo;
           	}
			return model;
		};
		this.getSPVerifyDataModel = function(model, responseData) {
			model.payeeName = responseData.payeeName;
			model.transactionAmount = '$ ' + responseData.amount;
			model.fundingAccountDisplayNameWithBalance = responseData.fundingAccountLabel;
			model.transactionInitiationDate = responseData.processDate;
			model.transactionDueDate = responseData.dueDate;
			model.memo = responseData.memo;
			model.formId = responseData.formId;
			return model;
		};
		this.getSPConfirmDataModel = function(model, responseData) {
			model.payeeName = responseData.payeeName;
			model.transactionNumber = responseData.paymentId;
			model.transactionAmount = '$ ' + responseData.amount;
			model.fundingAccountDisplayNameWithBalance = responseData.fundingAccountLabel;
			model.transactionInitiationDate = responseData.processDate;
			model.transactionDueDate = responseData.dueDate;
			model.memo = responseData.memo;
			return model;
		};

		this.getSPEnterViewFundAccountModel = function(modelRef) {
			var model = {
						'fundingAccountDisplayNameWithBalance': {
							'label': 'Pay from',
							'inputs': {
								'select': [{
									'id':'fundingAccountDisplayNameWithBalance',
									'name': 'accountSelect',
									'options': modelRef.fundingAcntsList
								}]
							}
						}
                    };
			return model;
		};
		this.getSPEnterViewModel = function(modelRef) {
			var model = {
						'paymentLinks': {
							id: 'paymentLinks',
							items:[{
								label: modelRef.pay_multiple_bills_navigation,
								url: '#'
							}, {
								label: modelRef.add_a_new_payee_navigation,
								url: '#/dashboard/payee'
							}, {
								label: modelRef.manage_payees_navigation,
								url: '#'
							}]
						},
			 			'payeeName': {
							'label': modelRef.payee_name_label,
							'for': 'payeeName',
							'inputs': {
								'select': [{
									'id':'payeeName',
									'name': 'payeeSelect',
									'options': modelRef.payeeList
								}]
							}
						},
						'fundingAccountDisplayNameWithBalance': {
							'label': modelRef.funding_account_display_name_with_balance_label,
							'for': 'fundingAccountDisplayNameWithBalance',
							'inputs': {
								'select': [{
									'id':'fundingAccountDisplayNameWithBalance',
									'name': 'accountSelect',
									'options': (modelRef.fundingAcntsList ? modelRef.fundingAcntsList : [{'value': '', 'label': modelRef.funding_account_display_name_with_balance_placeholder, 'selected':false}])
								}]
							}
						},
						'transactionAmount': {
							'label': modelRef.transaction_amount_label,
							'for': 'transactionAmount',
							'inputs': {
								'money': [{
									'id':'transactionAmount',
									'name': 'textAmount'
								}]
							}
						},
						'transactionInitiationDate': {
							'label': modelRef.transaction_initiation_date_label,
							'for': 'transactionInitiationDate',
							'inputs': {
								'date': [{
									'id':'transactionInitiationDate',
									'name': 'dateSendPaymentOn'
								}]
							}
						},
						'transactionDueDate': {
							'label': modelRef.transcation_due_date_label,
							'for': 'transactionDueDate',
							'inputs': {
								'date': [{
									'id':'transactionDueDate',
									'name': 'dateDeliverPaymentBy'
								}]
							}
						},
						'memo': {
							'label': (modelRef.memo_label + ' ' + modelRef.memo_advisory),
							'for': 'memo',
							'inputs': {
								'text': [{
									'id':'memo',
									'name': 'textMemo'
								}]
							}
						},
                    	'actions': [{
                    		'label': modelRef.cancel_label,
                    		'id': 'cancel-button'
	                    },
	                    {
	                    	'label': modelRef.next_label,
	                    	'classes': 'primary',
	                    	'id': 'next-button'
	                    }]
                    };
			return model;
		};
		this.getSPVerifyViewModel = function(modelRef) {
			var model = {
						'verifyFlowstepMessage': modelRef.lens('verify_merchant_bill_payment_message').get(),
			 			'payeeName': {
							'label': modelRef.lens('payee_name_label').get(),
							'inputs': {
								'data': [{
									'id':'payeeName'
								}]
							}
						},
						'fundingAccountDisplayNameWithBalance': {
							'label': modelRef.lens('funding_account_display_name_with_balance_label').get(),
							'inputs': {
								'data': [{
									'id':'fundingAccountDisplayNameWithBalance',
								}]
							}
						},
						'transactionAmount': {
							'label': modelRef.lens('transaction_amount_label').get(),
							'inputs': {
								'data': [{
									'id':'transactionAmount',
								}]
							}
						},
						'transactionInitiationDate': {
							'label': modelRef.lens('transaction_initiation_date_label').get(),
							'inputs': {
								'data': [{
									'id':'transactionInitiationDate',
								}]
							}
						},
						'transactionDueDate': {
							'label': modelRef.lens('transcation_due_date_label').get(),
							'inputs': {
								'data': [{
									'id':'transactionDueDate',
								}]
							}
						},
						'memo': {
							'label': modelRef.lens('memo_label').get(),
							'inputs': {
								'data': [{			//specific data inputs
									'id':'memo'
								}]
							}
						},
                    	'actions': [{
                    		'label': modelRef.lens('previous_label').get(),
                    		'id': 'previous-button'
	                    },
	                    {
                    		'label': modelRef.lens('cancel_label').get(),
                    		'id': 'cancel-button'
	                    },
	                    {
	                    	'label': modelRef.lens('confirm_merchant_bill_payment_label').get(),
	                    	'classes': 'primary',
	                    	'id': 'schedule-payment-button'
	                    }]
                    };
			return model;
		};
		this.getSPConfirmViewModel = function(modelRef) {
			var model = {
						'confirmFlowstepMessage': modelRef.lens('confirm_merchant_bill_payment_message').get(),
			 			'payeeName': {
							'label': modelRef.lens('payee_name_label').get(),
							'inputs': {
								'data': [{
									'id':'payeeName'
								}]
							}
						},
						'fundingAccountDisplayNameWithBalance': {
							'label': modelRef.lens('funding_account_display_name_with_balance_label').get(),
							'inputs': {
								'data': [{
									'id':'fundingAccountDisplayNameWithBalance'
								}]
							}
						},
						'transactionAmount': {
							'label': modelRef.lens('transaction_amount_label').get(),
							'inputs': {
								'data': [{
									'id':'transactionAmount'
								}]
							}
						},
						'transactionInitiationDate': {
							'label': modelRef.lens('transaction_initiation_date_label').get(),
							'inputs': {
								'data': [{
									'id':'transactionInitiationDate'
								}]
							}
						},
						'transactionDueDate': {
							'label': modelRef.lens('transcation_due_date_label').get(),
							'inputs': {
								'data': [{
									'id':'transactionDueDate'
								}]
							}
						},
						'memo': {
							'label': modelRef.lens('memo_label').get(),
							'inputs': {
								'data': [{
									'id':'memo'
								}]
							}
						},
						'transactionNumber': {
							'label': modelRef.lens('transaction_number_label').get(),
							'inputs': {
								'data': [{
									'id':'transactionNumber'
								}]
							}
						},
                    	'actions': [{
                    		'label': modelRef.lens('exit_label').get(),
                    		'id': 'close-button'
	                    }]
                    };
			return model;
		};

		return this;
	};
});
