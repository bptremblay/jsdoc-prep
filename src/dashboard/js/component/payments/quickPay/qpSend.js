define(function(require){

	var OptionsLookupMap = require('dashboard/lib/quickPay/qpOptionsLookupMap'),
		formatUtility = require('dashboard/lib/quickPay/qpFormatUtility'),
		componentChannel = require('blue/event/channel/component'),
		serviceErrorResponseHelper = require('dashboard/lib/quickPay/serviceErrorResponseHelper'),
		uiElements = require('dashboard/lib/quickPay/qpInputElements'),
		contentUtil = require('dashboard/lib/common/contentUtil'),
		dynamicContentUtil = require('common/utility/dynamicContentUtil');

	var context = null, validate = null;

	var getRepeatingPaymentServiceInput = function(serviceInput){
		serviceInput.frequency = this.transactionFrequencyOption;

		switch(this.transactionFrequencyOption) {
			case 'WEEKLY':
			case 'BIWEEKLY':
			case 'FOUR_WEEKS':
				serviceInput.dayOfWeek = this.transactionNotificationOption1;
				break;
			case 'MONTHLY':
			case 'BIMONTHLY':
			case 'QUARTERLY':
			case 'SEMI_ANNUALLY':
				serviceInput.dayOfMonth = this.transactionNotificationOption1;
				break;
			case 'TWICE_MONTHLY':
				serviceInput.dayOfMonth = this.transactionNotificationOption1;
				serviceInput.secondDayOfMonth = this.transactionNotificationOption2;
				break;
			case 'YEARLY':
				serviceInput.month = this.transactionNotificationOption1;
				serviceInput.dayOfMonth = this.transactionNotificationOption2;
				break;
		}
		serviceInput.sendOnDate =  this.transactionNotificationDate? this.transactionNotificationDate : null;
		serviceInput.openEnded = (this.transactionDuration === '1');
		serviceInput.numberOfPayments = this.transactionDurationOccurrences? this.transactionDurationOccurrences : null;
	};

	var setProgressSteps = function(totalSteps, currentStep){
		var steps = [];
		for (var i = 0; i < totalSteps; i++) {
			steps.push({
				'active': ((i+1)===currentStep),
				'title': ''
			});
		}
		return steps;
	};

	var updateNotificationSchedule = function(){
		var serviceInput = {};
		getRepeatingPaymentServiceInput.call(this, serviceInput);
		serviceInput.amount = this.transactionAmount? this.transactionAmount : 0;
		context.controllerChannel.emit('updateNotificationSchedule', serviceInput);
	};

	var updateNotifyOnDropdownModels = function(dropdownOption, notifyOnOption1, notifyOnOption2, label, prompt){
		if (dropdownOption === 'single') {
			context.model.lens('sendComponent.sendInputForm.notifyOnSingleDropdown1').set(context.dataTransform.getDropdownViewModel('notify_on_single_option1', context.model.lens('sendComponent.transaction_notification_option_label').get(), '', notifyOnOption1));
			context.model.lens('sendComponent.sendInputForm.notifyOnSingleDropdown1').get().prompt = prompt;
			context.model.lens('sendComponent.sendInputForm.notifyOnSingleDropdown1').get().info = true;
		} else {
			context.model.lens('sendComponent.sendInputForm.notifyOnMultiDropdown1').set(context.dataTransform.getDropdownViewModel('notify_on_multi_option1', context.model.lens('sendComponent.transaction_notification_option_label').get(), '', notifyOnOption1));
			context.model.lens('sendComponent.sendInputForm.notifyOnMultiDropdown2').set(context.dataTransform.getDropdownViewModel('notify_on_multi_option2', '', '', notifyOnOption2));
			context.model.lens('sendComponent.sendInputForm.notifyOnMultiDropdown2').get().label = label;
			context.model.lens('sendComponent.sendInputForm.notifyOnMultiDropdown2').get().prompt = prompt;
			context.model.lens('sendComponent.sendInputForm.notifyOnMultiDropdown1').get().info = true;
		}
	};

	var populateFirstNotificationDates = function(){
		var serviceInput = {};
		getRepeatingPaymentServiceInput.call(this, serviceInput);

	    context.qpServices.qpApi['quickpay.payment.repeating.dateoptions.list'](serviceInput).then(function(qpPaymentRepeatingDateOptionsListResponse){
			this.transactionNotificationDate = qpPaymentRepeatingDateOptionsListResponse.dateOptions[0];
			this.model.lens('transactionNotificationDate').set(qpPaymentRepeatingDateOptionsListResponse.dateOptions[0]);
			var dateOptions = [];
			for (var i = 0; i < qpPaymentRepeatingDateOptionsListResponse.dateOptions.length; i++) {
				dateOptions.push({label:qpPaymentRepeatingDateOptionsListResponse.dateOptions[i], value:qpPaymentRepeatingDateOptionsListResponse.dateOptions[i]});
			}
			context.model.lens('sendComponent.sendInputForm.firstNotificationDropdown').set(context.dataTransform.getDropdownViewModel('first_notification_date', context.model.lens('sendComponent.transaction_notification_recurring_date_label').get(), '', dateOptions));
            context.model.lens('sendComponent.sendInputForm.firstNotificationDropdown.info').set(true);
            componentChannel.emit('populateFirstNotificationDates', {dateOptions: dateOptions});
	    }.bind(this));
	};

	var getNotifyOnPromptWithSelection = function(){
		var prompt = '';
		switch(this.transactionFrequencyOption) {
			case 'WEEKLY':
				prompt = contentUtil.getValue('day_of_week', this.transactionNotificationOption1);
				break;
			case 'BIWEEKLY':
				prompt = contentUtil.getValue('day_of_week', this.transactionNotificationOption1);
				break;
			case 'FOUR_WEEKS':
				prompt = contentUtil.getValue('day_of_week', this.transactionNotificationOption1);
				break;
			case 'MONTHLY':
				prompt = contentUtil.getValue('day_of_month', this.transactionNotificationOption1);
				break;
			case 'BIMONTHLY':
				prompt = contentUtil.getValue('day_of_month', this.transactionNotificationOption1);
				break;
			case 'QUARTERLY':
				prompt = contentUtil.getValue('day_of_month', this.transactionNotificationOption1);
				break;
			case 'SEMI_ANNUALLY':
				prompt = contentUtil.getValue('day_of_month', this.transactionNotificationOption1);
				break;
			case 'TWICE_MONTHLY':
				prompt = contentUtil.getValue('day_of_month', this.transactionNotificationOption1) + ' and ' + contentUtil.getValue('day_of_month', this.transactionNotificationOption2);
				break;
			case 'YEARLY':
				prompt = contentUtil.getValue('month', this.transactionNotificationOption1) + ' ' + contentUtil.getValue('day_of_month', this.transactionNotificationOption2);
				break;
		}
		prompt += ' ' + dynamicContentUtil.dynamicContent.get(this, 'transaction_notification_option_advisory' + '.' + this.transactionFrequencyOption, {});

		return prompt;
	};

	var getAddOptions = function(qpRecipientListServiceResult, data) {

		var reqObj = undefined;
		if(data) {

			reqObj = { requestId: data.actionItemId };
		}
		context.qpServices.qpApi['quickpay.addoptions.list'](reqObj).then(function(qpAddOptionsListServiceResult){

		context.model.lens('sendComponent.steps').set(setProgressSteps(3,1));
		var sendInputForm =
			context.dataTransform.getSendInputViewModel(qpRecipientListServiceResult,
				qpAddOptionsListServiceResult, data);

		context.model.lens('sendComponent.fundingAccountId').set(sendInputForm.account);
		context.model.lens('sendComponent.transactionNotificationDate').set(sendInputForm.sendOn);
		context.model.lens('sendComponent.isShowRepeatingPayment').set(sendInputForm.isShowRepeatingPayment);

		//data from Solicited ToDo - Request Action Item's Send button
		if(data&&data.isFromSolicitedSendToDo===true) {
			//Through spec, this sets defaults values on all the elements
			//evan though, inputElements can set at least HTML element value.
			/*
			//Do not use data.amount from todo. It is on addoptions response.
			 if(data.amount) {
				this.transactionAmount = data.amount;
			}*/

			//Must set here because this.x does not work....
			//and other fields are from sendInputForm level.
			//Though, when setting model lens with names that match the input field ids,
			//the values seem to bind and populate on the input field.

			//This payeeId will show in UI but next 2 fields need to be defined to indicate nickname and name
			context.model.lens('sendComponent.payeeId').set(sendInputForm.payeeId);
			context.model.lens('sendComponent.isFromSolicitedSendToDo').set(data.isFromSolicitedSendToDo);
			context.model.lens('sendComponent.payeeNickname').set(sendInputForm.payeeNickname);
			context.model.lens('sendComponent.payeeName').set(sendInputForm.payeeName);

			context.model.lens('sendComponent.payeeContactInfoId').set(sendInputForm.payeeContactInfoId);
			context.model.lens('sendComponent.fundingAccountId').set(sendInputForm.account);
			context.model.lens('sendComponent.memo').set('');
			context.model.lens('sendComponent.transactionRecurring').set(false);
			context.model.lens('sendComponent.transactionDuration').set('1');
			context.model.lens('sendComponent.transactionAmount').set(sendInputForm.amount);

			context.model.lens('sendComponent.transactionNotificationDate').set(sendInputForm.sendOn);
			context.model.lens('sendComponent.dateRequestedBy').set(sendInputForm.dateRequestedBy);
			context.model.lens('sendComponent.solicitedSendcontactAddress').set(sendInputForm.contactAddress);
			context.model.lens('sendComponent.solicitedSendcontactType').set(sendInputForm.contactType);
			context.model.lens('sendComponent.requestId').set(sendInputForm.requestId);
		}
		context.model.lens('sendComponent.sendInputForm').set(sendInputForm);
		context.controllerChannel.emit('renderSendEntry');
	   	}.bind(this),
	        function(jqXHR) {
	        	this.context.logger.info( '***************** qpSend error response in quickpay.addoptions.list' );
	        }.bind(this)
	    );
	};

	var exitFlow = function(){
		if (context.model.lens('sendComponent.isFromSolicitedSendToDo').get()){
			context.controllerChannel.emit('indexTodo');
		} else {
			context.state('#/dashboard');
		}
	};

	return {
		init: function() {
			context = this.settings.context;
			validate = this.settings.validate;
			context.dataTransform.init(this.settings.context);
		},
		initializeEntryForm: function(){
			context.model.lens('sendComponent.payeeId').set('0@'+ this.model.lens('payee_name_placeholder').get());
			context.model.lens('sendComponent.payeeContactInfoId').set('0@'+ this.model.lens('payee_contact_info_placeholder').get());
			context.model.lens('sendComponent.fundingAccountId').set('0@Select account');
			context.model.lens('sendComponent.transactionAmount').set('');
			context.model.lens('sendComponent.memo').set('');
			context.model.lens('sendComponent.transactionRecurring').set(false);
		},
		initializeRepeatingPaymentFormElements: function(){
			context.model.lens('sendComponent.transactionFrequencyOption').set('MONTHLY');
			context.model.lens('sendComponent.sendInputForm.notifyOnSingleDropdown1').set(context.dataTransform.getDropdownViewModel('notify_on_single_option1', context.model.lens('sendComponent.transaction_notification_option_label').get(), '', context.dataTransform.getMonthDateOptions()));
			context.model.lens('sendComponent.sendInputForm.notifyOnSingleDropdown1').get().prompt = dynamicContentUtil.dynamicContent.get(this, 'transaction_notification_option_advisory.MONTHLY', {});
			context.model.lens('sendComponent.sendInputForm.notifyOnSingleDropdown1').get().info = true;
			context.model.lens('sendComponent.transactionNotificationOption1').set('ONE');
			context.model.lens('sendComponent.transactionNotificationDate').set('');
			context.model.lens('sendComponent.transactionDuration').set('1');
			context.model.lens('sendComponent.transactionDurationOccurrences').set('');
        	context.model.lens('sendComponent.sendInputForm.durationUIElements').get().inputs[1].text.disabled = true;
			context.model.lens('sendComponent.sendInputForm.notifyOnSingleDropdown').set(true);
		},
		setUserSelection: function(){
			// set model for previous click
			this.model.lens('payeeId').set(this.payeeId);
			this.model.lens('payeeContactInfoId').set(this.payeeContactInfoId);
			this.model.lens('fundingAccountId').set(this.fundingAccountId);
			this.model.lens('transactionNotificationDate').set(this.transactionNotificationDate);
			this.model.lens('transactionAmount').set(this.transactionAmount);
			this.model.lens('memo').set(this.memo);
			this.model.lens('transactionRecurring').set(this.transactionRecurring);
			this.model.lens('transactionFrequencyOption').set(this.transactionFrequencyOption);
			this.model.lens('transactionNotificationOption1').set(this.transactionNotificationOption1);
			this.model.lens('transactionNotificationOption2').set(this.transactionNotificationOption2);
			this.model.lens('transactionDuration').set(this.transactionDuration);
			this.model.lens('transactionDurationOccurrences').set(this.transactionDurationOccurrences);
			context.model.lens('sendComponent.sendInputForm.notifyOnSingleDropdown').set(this.transactionFrequencyOption != 'YEARLY' && this.transactionFrequencyOption != 'TWICE_MONTHLY');
		},
 		loadEntry: function(data){
 			if(data&&data.isFromSolicitedSendToDo) {
 				getAddOptions.call(this, null, data);
 			}
 			else
 			{
				context.qpServices.qpApi['quickpay.recipient.list']().then(function(qpRecipientListServiceResult){

					getAddOptions.call(this, qpRecipientListServiceResult, data);

		    	}.bind(this),
                function(jqXHR) {
                	this.context.logger.info( '***************** qpSend error response in quickpay.recipient.list' );
                }.bind(this)
			    );
	  		}
 		},
 		verifySendMoney: function(){
			this.setUserSelection();

 			var serviceInput = {}, todaysDate = formatUtility.formatDateUtility.formatDate(new Date());

			serviceInput.recipientId = uiElements.enumInputElementUtility.extractIdFromIdValue(this.payeeId);
			var payeeName = uiElements.enumInputElementUtility.extractValueFromIdValue(this.payeeId);
			context.model.lens('sendComponent.payeeName').set(payeeName);

			var isFromSolicitedSendToDo = context.model.lens('sendComponent.isFromSolicitedSendToDo').get();
			if(isFromSolicitedSendToDo==='true'||isFromSolicitedSendToDo === true) {
				serviceInput.recipientName  = context.model.lens('sendComponent.payeeName').get();
				serviceInput.recipientNickName = context.model.lens('sendComponent.payeeNickname').get();
				serviceInput.contactType = context.model.lens('sendComponent.solicitedSendcontactType').get();
				serviceInput.contactAddress = context.model.lens('sendComponent.solicitedSendcontactAddress').get();
				serviceInput.requestedByDate = context.model.lens('sendComponent.dateRequestedBy').get();
				serviceInput.requestId = context.model.lens('sendComponent.requestId').get();
			}

			serviceInput.contactId = uiElements.enumInputElementUtility.extractIdFromIdValue(this.payeeContactInfoId);
			serviceInput.fundingAccountId = uiElements.enumInputElementUtility.extractIdFromIdValue(this.fundingAccountId);
			serviceInput.amount = this.transactionAmount;
			serviceInput.memo = this.memo? this.memo : null;

 			if (this.transactionRecurring === 'true'){
				getRepeatingPaymentServiceInput.call(this, serviceInput);

	  		    context.qpServices.qpApi['quickpay.payment.repeating.validate'](serviceInput).then(function(qpPaymentRepeatingValidateResponse){
						context.controllerChannel.emit('showSendVerify', qpPaymentRepeatingValidateResponse);
	  		    	}.bind(this),
 					function(jqXHR) {
	 					context.logger.info( '***************** quickpay.payment.repeating.validateerror block' );
						serviceErrorResponseHelper.renderError(jqXHR, this, 'verify_send_money_error', {name: payeeName, DAYLIMIT: jqXHR.totalLimit, NUMBER: jqXHR.contactAddress, REMAININGLIMIT: jqXHR.remainingLimit, MONTHLIMIT: jqXHR.totalLimit, WEEKLIMIT:jqXHR.totalLimit}, {isHandlebar: true, emitMessage : 'qp_sendServerValidationError', targetId: '#errorMsg'});
					}.bind(this)
	  		    );
 			}
 			else {
 				//this.transactionNotificationDate now has yyyy-mm-dd, so this converts it to mm/dd/yyyy for service.
 				serviceInput.sendOnDate = (this.transactionNotificationDate === 'Today')? todaysDate : formatUtility.formatDateUtility.formatDashedYearMonthDayToSlashedMonthDayYear(this.transactionNotificationDate);
 				var that = this;
				context.qpServices.qpApi['quickpay.payment.validate'](serviceInput).then(function(qpPaymentValidateResponse) {
 					context.logger.info(qpPaymentValidateResponse);
 					context.controllerChannel.emit('showSendVerify', qpPaymentValidateResponse);
 					}.bind(this),
 					function(jqXHR) {
	 					context.logger.info( '***************** qpSend error block3' );
	 					var viewModel = context.dataTransform.getSendOverlayViewModel(jqXHR);
						context.model.lens('sendComponent.overlayModel').set(viewModel);
						context.model.lens('sendComponent.qpPaymentValidateResponse').set(jqXHR);
						if(jqXHR.statusCode === 'DUPLICATE_PMT')
						{
							serviceErrorResponseHelper.renderError(jqXHR, this, 'verify_send_money_error', null, {isHandlebar: true, emitMessage : 'renderDuplicatePaymentOverlay', targetId: '#duplicateOverlay'});
						}else{
							serviceErrorResponseHelper.renderError(jqXHR, this, 'verify_send_money_error', {name: payeeName, DAYLIMIT: jqXHR.totalLimit, NUMBER: jqXHR.contactAddress, REMAININGLIMIT: jqXHR.remainingLimit, MONTHLIMIT: jqXHR.totalLimit, WEEKLIMIT:jqXHR.totalLimit}, {isHandlebar: true, emitMessage : 'qp_sendServerValidationError', targetId: '#errorMsg'});
						}
					}.bind(this));
 			}
 		},
 		loadVerify: function(data){
			var sendVerifyForm = {};
			context.model.lens('sendComponent.steps').set(setProgressSteps(3,2));
			sendVerifyForm = context.dataTransform.getSendVerifyViewModel(data);
			context.model.lens('sendComponent.sendVerifyForm').set(sendVerifyForm);
			context.model.lens('sendComponent.formId').set(sendVerifyForm.formId);
			context.controllerChannel.emit('renderSendVerify');
 		},
 		cancelOverlay : function() {
			context.controllerChannel.emit('showSendEntry');
 		},
 		sendOverlay:function() {
			context.controllerChannel.emit('showSendVerify', context.model.lens('sendComponent.qpPaymentValidateResponse').get());
 		},
 		confirmSendMoney: function(){
			var input = {};

			input.formId = context.model.lens('sendComponent.formId').get();
			var payeeName = context.model.lens('sendComponent.payeeName').get();

 			if (this.transactionRecurring === 'true'){
			    context.qpServices.qpApi['quickpay.payment.repeating.add'](input).then(function(qpPaymentRepeatingAddResponse){
					context.controllerChannel.emit('showSendConfirm', qpPaymentRepeatingAddResponse);
			    }.bind(this),
 					function(jqXHR) {
	 					context.logger.info( '***************** quickpay.payment.repeating.add error block' );
						serviceErrorResponseHelper.renderError(jqXHR, this, 'confirm_send_money_error', {name: payeeName}, {isHandlebar: true, emitMessage : 'qp_sendServerValidationError', targetId: '#errorMsg'});
					}.bind(this));
			} else {
			    context.qpServices.qpApi['quickpay.payment.add'](input).then(function(qpPaymentAddResponse){
					context.controllerChannel.emit('showSendConfirm', qpPaymentAddResponse);
			    }.bind(this),
 					function(jqXHR) {
	 					context.logger.info( '***************** quickpay.payment.add error block' );
						serviceErrorResponseHelper.renderError(jqXHR, this, 'confirm_send_money_error', {name: payeeName}, {isHandlebar: true, emitMessage : 'qp_sendServerValidationError', targetId: '#errorMsg'});
					}.bind(this));
			}
 		},
 		loadConfirm: function(data){
			var sendConfirmForm = {};

			context.model.lens('sendComponent.steps').set(setProgressSteps(3,3));
			sendConfirmForm = context.dataTransform.getSendConfirmViewModel(data);
			context.model.lens('sendComponent.sendConfirmForm').set(sendConfirmForm);
			context.controllerChannel.emit('renderSendConfirm');
 		},
 		intiateSendMoney: function(){
 			//Set the value on the date input because it must be on the value object to update
 			context.model.lens('sendComponent.sendInputForm.sendOnDateInput').set(
 				context.dataTransform.getSendOnDateInput(
 					context.model.lens('sendComponent.transactionNotificationDate').get()));

			context.controllerChannel.emit('showSendEntry');
 		},
 		exitSendMoney: function(){
 			exitFlow();
		},
		cancelSendMoney: function(){
 			exitFlow();
		},
		requestMoneyTransferContactInfo: function(){
			var recipientId = 0;

			if(typeof(this.payeeId)!=='undefined'&&this.payeeId!==null&&
				this.payeeId.length&&this.payeeId.length>0&&this.payeeId.indexOf){
				var atSignIndex = this.payeeId.indexOf('@');

				if(atSignIndex>0) {
					recipientId = this.payeeId.substring(0, atSignIndex);
				}
			}
			else {
				//log that it's not defined or a string
				//recipientId = 0;
			}

			var defaultSelectValueId = '0@' + this.model.lens('payee_contact_info_placeholder').get();

			if(recipientId==0) { //Purposely == --> if both string or number is 0.


				//$('#payeeContactInfoId').addClass('classDis');
				var $tokenDD = $('#payeeContactInfoId');

				$tokenDD.attr('disabled','disabled');
				$tokenDD.val(defaultSelectValueId);
			}

 			// get tokens for this recipient
			// TODO: list2 service returns recipient data, remove it when connecting to api
		    recipientId>0&&context.qpServices.qpApi['quickpay.addoptions.list2']({recipientId:recipientId}).then(function(qpAddOptionsListServiceResult){
				var tokenData = [];
				var tokenOptions = {defaultSelectValueId:this.model.lens('payee_contact_info_placeholder').get()};
				tokenData.push({key:0, value:this.model.lens('payee_contact_info_placeholder').get(), default:false});

				// populate token data
		    	for (var i = 0; i < qpAddOptionsListServiceResult.recipientDetail.contacts.length; i++) {
					tokenData.push({key:qpAddOptionsListServiceResult.recipientDetail.contacts[i].id, value:qpAddOptionsListServiceResult.recipientDetail.contacts[i].address, default:qpAddOptionsListServiceResult.recipientDetail.contacts[i].defaultContact});
					tokenOptions[qpAddOptionsListServiceResult.recipientDetail.contacts[i].id + '@' + qpAddOptionsListServiceResult.recipientDetail.contacts[i].address] = qpAddOptionsListServiceResult.recipientDetail.contacts[i].address;
		    	}

		    	// add token actions
		    	context.dataTransform.addTokenActions(tokenData, tokenOptions, qpAddOptionsListServiceResult.recipientDetail.contacts);

				var tokenLookup = new OptionsLookupMap(tokenOptions, '0', false, '0');
		        var tokenFilter =  {
		        	'label': this.model.lens('payee_contact_info_label').get(),
		        	'inputs': {
			            'select': {
							'id': 'payeeContactInfoId',
							'options': tokenLookup.getBaseOptionsFilterObj()
							//,
							//'classIds': 'classActive'//????  //Make sure this writes over entire class attribute to rid the classDisabled.

			    		}
		        	}
		        };
				context.model.lens('sendComponent.sendInputForm.tokenDropdown').set(tokenFilter);

				// select default token
				for (var j = 0; j < tokenData.length; j++) {
					if (tokenData[j].default) {
						this.payeeContactInfoId = tokenData[j].key + '@' + tokenData[j].value;
						break;
					}
				}

				// select default account
				for (var k = 0; k < qpAddOptionsListServiceResult.fundingAccounts.length; k++) {
					if (qpAddOptionsListServiceResult.fundingAccounts[k].defaultAccount) {
						this.fundingAccountId = qpAddOptionsListServiceResult.fundingAccounts[k].id + '@' + qpAddOptionsListServiceResult.fundingAccounts[k].label;
						break;
					}
				}

				// send message to view to populate token dropdown
	            componentChannel.emit('populateTokens', {tokenData: tokenData});
			}.bind(this));
		},
		sendMoreMoney: function(){
			context.controllerChannel.emit('showSendEntry', {defaults: true});
		},
 		requestMoney: function(){
			context.controllerChannel.emit('showRequestEntry', {defaults: true});
 		},
 		repeatingPaymentOn: function(){
 			this.toggleTransactionRecurring(true);
 		},
 		repeatingPaymentOff: function(){
 			this.toggleTransactionRecurring(false);
 		},
 		toggleTransactionRecurring: function(toggleSwitch){
			this.model.lens('transactionRecurring').set(toggleSwitch);
			context.model.lens('sendComponent.sendInputForm.transactionRecurring').set(toggleSwitch);
			componentChannel.emit('showHideSendOnInput', { showHideOption: (toggleSwitch)? 'hide' : 'show'});


			//Both renderRepeatingPaymentOptions emit message and populateFirstNotificationDates function
			//overwrites sendComponent.transactionNotificationDate,
			//so to keep the Non repeating Send On input in tact, save off the value in a variable to
			//set back again into sendComponent.transactionNotificationDate when Recurring is off again.
			var transNotifDate = context.model.lens('sendComponent.transactionNotificationDate').get();				context.model.lens('sendComponent.transactionNotificationDate_NonRecurringSaved').set(transNotifDate);

			//this inits sendComponent.transactionNotificationDate to blank. Must save before this.
			context.controllerChannel.emit('renderRepeatingPaymentOptions', {transactionRecurring: toggleSwitch});

			if (this.transactionRecurring === 'true'){

				context.model.lens('sendComponent.transactionNotificationDate_NonRecurringSaved').set(transNotifDate);
				// delay added for the execuateCAV to finish rendering the dropdown before populating it
				setTimeout(function() {
					populateFirstNotificationDates.call(this);

					// delay added for the firstNotificationDate dropdown to be populated
					setTimeout(function() {
		 				updateNotificationSchedule.call(this);
		 			}.bind(this), 500);
				}.bind(this), 100);
			}
			else {
				var transNotifDateNonRecurringSaved = context.model.lens('sendComponent.transactionNotificationDate_NonRecurringSaved').get();
				context.model.lens('sendComponent.transactionNotificationDate').set(transNotifDateNonRecurringSaved);
			}
 		},
 		requestTransactionNotificationOptions: function(){
 			var dropdownOption = 'single', notifyOnOption1 = null, notifyOnOption2 = null, label = '', prompt = '';

			switch(this.transactionFrequencyOption) {
				case 'WEEKLY':
					dropdownOption = 'single';
					notifyOnOption1 = context.dataTransform.getWeekDaysOptions();
					this.model.lens('transactionNotificationOption1').set('MON');
					break;
				case 'BIWEEKLY':
					dropdownOption = 'single';
					notifyOnOption1 = context.dataTransform.getWeekDaysOptions();
					this.model.lens('transactionNotificationOption1').set('MON');
					break;
				case 'FOUR_WEEKS':
					dropdownOption = 'single';
					notifyOnOption1 = context.dataTransform.getWeekDaysOptions();
					this.model.lens('transactionNotificationOption1').set('MON');
					break;
				case 'MONTHLY':
					dropdownOption = 'single';
					notifyOnOption1 = context.dataTransform.getMonthDateOptions();
					this.model.lens('transactionNotificationOption1').set('ONE');
					break;
				case 'BIMONTHLY':
					dropdownOption = 'single';
					notifyOnOption1 = context.dataTransform.getMonthDateOptions();
					this.model.lens('transactionNotificationOption1').set('ONE');
					break;
				case 'QUARTERLY':
					dropdownOption = 'single';
					notifyOnOption1 = context.dataTransform.getMonthDateOptions();
					this.model.lens('transactionNotificationOption1').set('ONE');
					break;
				case 'SEMI_ANNUALLY':
					dropdownOption = 'single';
					notifyOnOption1 = context.dataTransform.getMonthDateOptions();
					this.model.lens('transactionNotificationOption1').set('ONE');
					break;
				case 'TWICE_MONTHLY':
					dropdownOption = 'multi';
					notifyOnOption1 = context.dataTransform.getMonthDateOptions();
					notifyOnOption2 = context.dataTransform.getMonthDateOptions('FIFTEEN');
					this.model.lens('transactionNotificationOption1').set('ONE');
					this.model.lens('transactionNotificationOption2').set('FIFTEEN');
					label = 'and';
					break;
				case 'YEARLY':
					dropdownOption = 'multi';
					notifyOnOption1 = context.dataTransform.getMonthOptions();
					notifyOnOption2 = context.dataTransform.getMonthDateOptions();
					this.model.lens('transactionNotificationOption1').set('JAN');
					this.model.lens('transactionNotificationOption2').set('ONE');
					label = '';
					break;
			}
			prompt = dynamicContentUtil.dynamicContent.get(this, 'transaction_notification_option_advisory' + '.' + this.transactionFrequencyOption, {});
			context.model.lens('sendComponent.sendInputForm.notifyOnSingleDropdown').set(dropdownOption === 'single');
			if(notifyOnOption1)
			{
				notifyOnOption1.info = true;
			}
			if(notifyOnOption2){ notifyOnOption2.info = true; }
			componentChannel.emit('showHideNotifyOnDropdowns',  { updateOption:'dropDown', dropdownOption:dropdownOption, notifyOnOption1:notifyOnOption1, notifyOnOption2:notifyOnOption2, label:label, prompt:prompt });
 			updateNotifyOnDropdownModels.call(this, dropdownOption, notifyOnOption1, notifyOnOption2, label, prompt);
			populateFirstNotificationDates.call(this);

			// delay added for the firstNotificationDate dropdown to be populated
			setTimeout(function() {
 				updateNotificationSchedule.call(this);
 			}.bind(this), 500);
 		},
		toggleTransactionNotifications: function(){
 		},
		toggleQuickpayNewsHelpMessage: function(){
			componentChannel.emit('showNewWithChase');
 		},
		toggleMoneyTransferContactHelpMessage: function(){
			componentChannel.emit('showMoneyTransferContactHelpMessage');

 		},
		toggleTransactionNotificationOptionHelpMessage: function(){
			componentChannel.emit('showTransactionNotificationOptionHelpMessage');
 		},
		toggleTransactionNotificationDateHelpMessage: function(){
			componentChannel.emit('showTransactionNotificationDateHelpMessage');
 		},
 		toggleTransactionNotificationRecurringDateHelpMessage: function() {
			 componentChannel.emit('showTransactionNotificationRecurringDateHelpMessage');
 		},
 		notifyOnOption1Changed: function(){
			populateFirstNotificationDates.call(this);

			// delay added for the firstNotificationDate dropdown to be populated
			setTimeout(function() {
 				updateNotificationSchedule.call(this);
 			}.bind(this), 500);
 		},
 		notifyOnOption2Changed: function(){
			populateFirstNotificationDates.call(this);

			// delay added for the firstNotificationDate dropdown to be populated
			setTimeout(function() {
 				updateNotificationSchedule.call(this);
 			}.bind(this), 500);
 		},
 		firstNotificationDateChanged: function(){
 			updateNotificationSchedule.call(this);
 		},
 		toggleTransactionDurationOption: function(){
 			if (this.transactionDuration === '1' || (this.transactionDuration === '2' && this.transactionDurationOccurrences != '')){
	 			updateNotificationSchedule.call(this);
 			}

            componentChannel.emit('enableDisableNumberOfPayments', {transactionDuration: this.transactionDuration});
            if (this.transactionDuration === '2'){
	            delete context.model.lens('sendComponent.sendInputForm.durationUIElements').get().inputs[1].text.disabled;
            }
            else {
	        	context.model.lens('sendComponent.sendInputForm.durationUIElements').get().inputs[1].text.disabled = true;
            }
 		},
 		transactionDurationOccurrencesChanged: function(){
 			if (this.transactionDurationOccurrences != ''){
 				updateNotificationSchedule.call(this);
 			}
 		},
 		transactionAmountChanged: function(){
 			if (this.transactionRecurring === 'true'){
 				updateNotificationSchedule.call(this);
 			}
 		},

 		getNotifyOnPromptWithSelection: getNotifyOnPromptWithSelection,
 		//Close
 		hideQuickpayNewsHelpMessage: function() {
			componentChannel.emit('hideNewWithChaseHelp');
		},
		hideMoneyTransferContactHelpMessage : function() {
			componentChannel.emit('hideMoneyTransferContactHelpMessage');
		},
		hideTransactionNotificationDateHelpMessage : function() {
			componentChannel.emit('hideTransactionNotificationDateHelpMessage');

		},
		hideTransactionNotificationRecurringDateHelpMessage : function() {
			componentChannel.emit('hideTransactionNotificationRecurringDateHelpMessage');

		},
		hideTransactionNotificationOptionHelpMessage:function() {
			componentChannel.emit('hideTransactionNotificationOptionHelpMessage');
		},
		//Multiple
		toggleTransactionNotificationMultiOptionHelpMessage: function(){
			componentChannel.emit('showTransactionNotificationMultiOptionHelpMessage');
 		},
 		hideTransactionNotificationMultioptionHelpMessage:function() {
			componentChannel.emit('hideTransactionNotificationMultiOptionHelpMessage');
		}
 	};
 });
