define(function() {
	var context = null,
		validate = null;
	return {
		init: function() {
			context = this.settings.context;
			validate = this.settings.validate;
		},
		addANewPayee: function() {

        },
        //action to call Merchant Payee Add service on click of Add on Verify page
		addPayee: function() {
			//Pass different request params based on manual address entry vs. radio option only
			var verifyAddressReqData = {
				'payeeOptionId': 0, //Always pass 0 while adding manual address
				'payeeName': this.payeeName,
				'accountNumber': this.payeeAccountNumber ? this.payeeAccountNumber : '',
				'address1': this.mailingAddressLine1,
		 		'address2': this.mailingAddressLine2,
		 		'city': this.city,
		 		'stateCode': this.state,
		 		'zipCode': this.zipCode,
 		 		'payeeCountry': 'US',//  TODO: Note:  US is defaulted as we dont have any field in UI; make necessary updates
		 		'phoneNumber': this.phoneNumber
			};
			if(this.zipCodeExtension ){// Only send to service if user has entered something | TODO: should we also trim the users input?
		 		verifyAddressReqData.zipExt = this.zipCodeExtension;
		 	}
			var verifyMultiSelectReqData = {
            	payeeOptionId: this.payeeId ? this.payeeId : ''
            };
            //TODO: Validate radio-option is selected or not else valdate address entrees
            var verifyReqData = (this.mailingAddressLine1 && this.city && this.state && this.zipCode) ? verifyAddressReqData : verifyMultiSelectReqData;
			verifyReqData.fundingAccountId = this.fundingAccountId ? this.fundingAccountId : '';
			verifyReqData.payeeNickname = this.payeeNickname ? this.payeeNickname : '';
			verifyReqData.groupId = this.payeeCategoryId ? this.payeeCategoryId : '';
            
            context.payeeServices.payee.payeeConfirm(verifyReqData).then(
            	function(data) {
	                context.controllerChannel.emit('setPayeeConfirm', data);
	            }.bind(this),
                function(jqXHR) {
                    context.logger.info('jqXHR : ', jqXHR);
                }.bind(this)
            );
		},
        //action to call Merchant Payee Search service on click of Next on Entry page
		advanceFlow: function() {
            var enterReqData = {
            	payeeName: this.payeeName ? this.payeeName : '',
                zipCode: this.zipCode ? this.zipCode : '',
                zipExt: this.zipCodeExtension ? this.zipCodeExtension : '',
                accountNumber: this.payeeAccountNumber ? this.payeeAccountNumber : '',
                confirmAccountNumber: this.payeeConfirmedAccountNumber ? this.payeeConfirmedAccountNumber : ''
            };
			context.payeeServices.payee.payeeVerify(enterReqData).then(
				function(data) {
					//store data which will be used for Previous button click
					data.entryData = enterReqData;
					if (data.payeeOptions) {       //payeeOptions is returned only if seach is found
						context.controllerChannel.emit('setPayeeVerify', data);      
					}      
					else {      
						context.componentChannel.emit('setPayeeNotFound', {//emitting message to payeeManual controller
							'payeeName': this.payeeName,
							'zipCode': this.zipCode,
							'zipCodeExtension': this.zipCodeExtension,
							'accountNumber': this.payeeAccountNumber
						});      
					}

				}.bind(this),
				function(jqXHR) {
					context.logger.info('jqXHR : ', jqXHR);
				}.bind(this)
			);
		},
        //action to go back to Entry page on click of Previous on Verify page
		reverseFlow: function() {
			context.controllerChannel.emit('setPayeeEntry');
		},
        //action to exit or cancel the flow
		exitFlow: function() {
	        context.state('/dashboard');		// TODO:  take the URL from settings remove hardcoding
		},
        //TODO - Future sprint for add payee search tab
		switchToSearchMode: function() {

		},
        //TODO - Future sprint for add payee manually tab
		switchToManualMode: function() {

		},
		initiateAddPayeeViaSearch: function() {
			context.controllerChannel.emit('setPayeeExit');
		},
		//Enter different address
		toggleEnterDifferentAddress: function() {
			//Since we've only 1 action to toggle, we need to set flag to check if address section is expanded/collapsed
			//Make service call to populate state dropdown only when Address section is expanded
			if(this.enterDifferentAddressDisplayed) {
				this.enterDifferentAddressDisplayed = false;
				this.mailingAddressLine1 = '';
				this.mailingAddressLine2 = '';
				this.city = '';
				this.state = '';
				this.zipCode = '';
				this.phoneNumber = '';
			}
			else {
			context.myProfileServices.mailingAddress['myProfile.mailingAddress.stateList.svc']( { 'addressType':'USA' })
				.then(
            	function(stateListResp) {
            		this.model.lens('payeeVerifyComponent.stateList').set(stateListResp.states);
            		this.enterDifferentAddressDisplayed =true;	
					context.controllerChannel.emit('setPayeeAddressManualEntry');
	            }.bind(this),
                function(jqXHR) {
                	//TODO:  error handling future sprint.
                    this.logger.info("jqXHR : ", jqXHR);
                }.bind(this)
            );
            }
		},
		initiateSendMoney: function() {

		},
		toggleNoPayeeAccountNumber: function() {

		},
		makePayment: function() {
			// emit this Signal to load "Pay To" dropdown on Bill Pay page
	        context.state('#/dashboard/payBill?payeeId=' + this.payeeId);
		}
	};
});
