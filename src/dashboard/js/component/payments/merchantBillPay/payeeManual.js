/*  ======== Payee Manual Component ========== */
define(function() {
	var context = null,
	validate = null;

	return {
		init: function() {
			context = this.settings.context;
			validate = this.settings.validate;
		},

		cancelAddPayee: function() {
        	context.controllerChannel.emit('setCancelAddPayee');
		},

		/**
		 * This is called when user clicks Back on Verify step Add payee Manually flow.
		 * @function providePayeeInformation
		 * @memberOf module:payeeManual
		 */
		providePayeeInformation: function() {
			context.controllerChannel.emit('setPayeeManualEntry');
		},

		searchForPayee: function() {
		},

		/**
		 * This is called when user clicks next on step one of add payee Manually, this will trigger validation of input fields via service.
		 * @function verifyAddPayee
		 * @memberOf module:payeeManual
		 */
		 verifyAddPayee: function() {
			var verifyReqData = {
		 		'payeeName': this.payeeName,
		 		'payeeNickname': this.payeeNickname,
		 		'payeeAddressLine1': this.mailingAddressLine1,
		 		'payeeAddressLine2': this.mailingAddressLine2,
		 		'payeeCity': this.city,
		 		'payeeState': this.state,
		 		'payeeZIPCode': this.zipCode,
 		 		'payeeCountry': 'US',//  TODO: Note:  US is defaulted as we dont have any field in UI; make necessary updates
		 		'payeePhone': this.phoneNumber
		 	};

		 	if(this.zipCodeExtension ){// Only send to service if user has entered something | TODO: should we also trim the users input?
		 		verifyReqData.payeeZIPExtension= this.zipCodeExtension;
		 	}

 			//The dont get confused with the name accountNumberAvailable it should be accountNumberNotAvailable considering the UI and checkbox.
 			if(this.accountNumberAvailable === 'false'){
 				//if account number is available then send payeeAccountNumber & confirmAccountNumber but dont send  messageToPayee
 				verifyReqData.payeeAccountNumber = this.accountNumber;
 				verifyReqData.confirmAccountNumber = this.confirmedAccountNumber ;
 			}else{
 				 //if account number is NOT available then send messageToPayee but dont send payeeAccountNumber & confirmAccountNumber
 				 verifyReqData.messageToPayee = this.noteForPayee;
 			}

			context.payeeServices.payeeManual.payeeManualAddValidate(verifyReqData).then(function(data) {
            		//store data which will be used for Previous button click
					data.entryData = verifyReqData;
            		//TODO: add condition to check if any error from service; not done as its not aa part of sprint 3
            		context.controllerChannel.emit('setPayeeManualVerify', data);
            	}.bind(this),
            	function(jqXHR) {
                	//TODO:  error handling future sprint.
                	context.logger.info('jqXHR : ', jqXHR);
                }.bind(this)
            );
 		},

		confirmAddPayee: function() {
			var confirmReqData = {
	 			'formId': this.formId,
				'fundingAccountId': this.fundingAccountId,
				'payeeGroupId':this.payeeCategoryId
 			};

			context.payeeServices.payeeManual.payeeManualAddConfirm(confirmReqData).then(function(data) {
	            	context.controllerChannel.emit('setPayeeManualConfirm', data);
	            }.bind(this),
                function(jqXHR) {
                    context.logger.info('jqXHR : ', jqXHR);
                }.bind(this)
            );
  		},

		addPayee: function() {
			context.state('#/dashboard/payee');
  		},

		makePayment: function() {
			 context.state('#/dashboard/payBill/?payeeId=' + this.payeeId);
  		},

		setUpRepeatingPayment: function() {
			// Emit state to setAccountNumberOptions view to enable disable account number textbox
			this.output.emit('state', {
				target: this,
				value: 'setAccountNumberOptions',
				accountNumberAvailable: this.accountNumberAvailable
			});
		},

		sendMoney: function() {
		}

	};
});
