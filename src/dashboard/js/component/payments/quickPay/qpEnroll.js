define(function(require){
	var context = null, validate = null;
	var componentChannel = require('blue/event/channel/component');

	var getEnrollmentAddServiceInput = function(emailList, phoneList){
		var input = {}, secondaryEmailIndex = 1;

		var email = null;
		// add emails to input
		for (var i = 0; i < emailList.length; i++) {
			email = emailList[i];

			if (email.primaryDesignation===true || emailList.length === 1) {
				if (email.id == '0') {
					input.newPrimaryEmail = email.emailAddress;
				}
				else {
					input.eligiblePrimaryEmailId = email.id;
				}
			}
			else {
				if (email.id == '0') {
					input['newSecondaryEmail' + secondaryEmailIndex] = email.emailAddress;
				}
				else {
					input['eligibleSecondaryEmail' + secondaryEmailIndex + 'Id'] = email.id;
				}
				++secondaryEmailIndex;
			}
		}

		// add mobile to input
		if (phoneList[0].id != '0') {
			input.eligibleMobileId = phoneList[0].id;
		}
		else if (phoneList[0].phoneNumber != '') {
			input.newMobile = phoneList[0].phoneNumber;
		}

		return input;
	};

	var showTcpaDisclosure = function(showHide){
        this.output.emit('state', {
            target: this,
            value: 'showHideTcpaDisclosure',
            showHideOption: {option: showHide}
        });
	};

	var getEmailHeading = function(num, isPrimary) {
		var emailHeading = ((num > 1 ? num : '')+
			(isPrimary&&isPrimary===true ? '' :' (optional)') );

		return emailHeading;

	};

	var updateEmailHeadings = function(emailList) {

		if(emailList&&emailList.length&&emailList.length>0) {
			var emailAddress = null;

			var isPrimary = false;
			var emailAddressesLength = emailList.length;

			for(var i = 0; i<emailAddressesLength; i++) {
				var emailNum = (i+1);

				emailAddress = emailList[i];

				isPrimary = emailAddressesLength==1 || (emailAddress.primaryDesignation ? emailAddress.primaryDesignation === true : false);
				emailAddress.emailHeading = getEmailHeading(emailNum, isPrimary);
			}
		}
	};


	var getPrimarySelectedEmail = function(emailList) {

		if(emailList&&emailList.length&&emailList.length>0) {
			var emailAddress = null;

			for(var i = 0; i<emailList.length; i++) {

				emailAddress = emailList[i];

				if(emailAddress.primaryDesignation===true) {
					return emailAddress;
				}
			}
		}
		return null;
	};

	var populatePhoneNumber = function() {

		var phoneNumbers = this.model.lens('phoneNumbers').get();

		if (this.model.lens('isNoMobileInCis').get()===true||context.dataTransform.isMobileAdded(phoneNumbers)){
			var phoneNumber = $("input[type='text'][name='phone_number1']").val() + $("input[type='text'][name='phone_number2']").val() + $("input[type='text'][name='phone_number3']").val();
			phoneNumbers[0].phoneNumber = phoneNumber;
			this.model.lens('phoneNumbers').set(phoneNumbers);
		}

	};

	var isOtherEmailsAddedButNotEntered = function(emailAddresses) {

		if(emailAddresses) {

			for(var i=0;i<emailAddresses.length;i++) {
				if(isEmailAddressValid(emailAddresses[i])===false) {
					return true;
				}
			}
		}
		return false;
	};

	var isEmailAddressValid = function(primaryEmailAddress) {

		if(primaryEmailAddress&&primaryEmailAddress.emailAddress) {
			return (primaryEmailAddress.emailAddress!==''&&primaryEmailAddress.emailAddress!=='Select email');
		}
		return false;

	};
	var triggerVerifyService = function(data){

		var reqObj = {};
		reqObj.contactId = data.contactId;
		reqObj.verificationCode = data.verificationCode;

		context.qpServices.qpApi['quickpay.contact.verify'](reqObj).then(function(dataCheck){
			var showHide = ((dataCheck.quickPayContactVerificationStatus  === 'VERIFIED') && (data.verificationCode.length > 7))? 'show' : 'hide';

			componentChannel.emit('showHideVerify',  {
				option: showHide,
				contactId: data.contactId
			});

	    }.bind(this));
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

	return {
		init: function() {
			context = this.settings.context;
			validate = this.settings.validate;
			context.dataTransform.init(this.settings.context);

			componentChannel.on('triggerVerifyService', function(data) {
				triggerVerifyService(data);
       		});
		},

		loadSetup: function(data){
			var enrollSetupForm = context.dataTransform.getEnrollSetupViewModel();
			context.model.lens('enrollComponent.enrollSetupForm').set(enrollSetupForm);
			context.controllerChannel.emit('renderEnrollSetup');
		},

		initiateQuickpayEnrollment: function(){
			// TODO: Call new service quickpay-xxx to enroll user
  		    // context.qpServices.qpApi['quickpay.xxx']().then(function(qpEnrollmentResponse){
				context.controllerChannel.emit('showEnrollEntry');
		    // }.bind(this));
		},

		loadEntry: function(data){
			// Call service quickpay-enrollment-options-list
  		    context.qpServices.qpApi['quickpay.enrollmentoptions.list']().then(function(qpEnrollmentOptionsListResponse){
				var viewModel = context.dataTransform.getEnrollEntryViewModel(qpEnrollmentOptionsListResponse);
				this.model.lens('quickpayEnrollmentLegalAcceptance').set(viewModel.quickpayEnrollmentLegalAcceptance);
				this.model.lens('emailAddresses').set(viewModel.emailAddresses);
				this.model.lens('showMultipleRows').set(viewModel.showMultipleRows);
				this.model.lens('isNoEmailInCis').set(viewModel.isNoEmailInCis);
				this.model.lens('isNoMobileInCis').set(viewModel.isNoMobileInCis);
				this.model.lens('emailOptions').set(viewModel.emailOptions);
				this.model.lens('phoneNumbers').set(viewModel.phoneNumbers);
				this.model.lens('mobileOptions').set(viewModel.mobileOptions);
				//context.model.lens('enrollComponent.steps').set(setProgressSteps(3,1));
				context.controllerChannel.emit('renderEnrollEntry');
		    }.bind(this));
		},

		verifyQuickpayEnrollment: function(){
			if (this.validateInputForm()){
				// get service input
				var input = getEnrollmentAddServiceInput(this.model.lens('emailAddresses').get(), this.model.lens('phoneNumbers').get());

				// Call service quickpay-enrollment-add
	  		    context.qpServices.qpApi['quickpay.enrollment.add'](input).then(function(qpEnrollmentAddResponse){
					context.controllerChannel.emit('showEnrollVerify', qpEnrollmentAddResponse);
			    }.bind(this));
			}
		},

		loadVerify: function(data){
			var enrollVerifyForm = context.dataTransform.getEnrollVerifyViewModel(data);
			context.model.lens('enrollComponent.steps').set(setProgressSteps(3,2));
			context.model.lens('enrollComponent.enrollVerifyForm').set(enrollVerifyForm);
			context.controllerChannel.emit('renderEnrollVerify');
		},
		confirmQuickpayEnrollment: function(){
			// Call service quickpay-enrollment-contact-list
  		    context.qpServices.qpApi['quickpay.enrollment.contact.list']().then(function(confirmList){
				context.controllerChannel.emit('showEnrollConfirm', confirmList);
		    }.bind(this));
		},

		loadConfirm: function(data){
			var enrollConfirmForm = context.dataTransform.getEnrollConfirmViewModel(data);
			context.model.lens('enrollComponent.steps').set(setProgressSteps(3,3));
			context.model.lens('enrollComponent.enrollConfirmForm').set(enrollConfirmForm);
			context.controllerChannel.emit('renderEnrollConfirm');
		},

		cancelQuickpayEnrollment: function(){
			context.state('#/dashboard');
		},

		exitQuickpayEnrollment: function(){
			context.state('#/dashboard');
		},

		sendMoney: function(){
			context.controllerChannel.emit('showSendEntry', {defaults: true});
		},

		requestMoney: function(){
			context.controllerChannel.emit('showRequestEntry', {defaults: true});
		},

		deleteEmailAddress: function(inputData){
			var emailList = this.model.lens('emailAddresses').get();
			emailList.splice(inputData.dataPath.substr(inputData.dataPath.length-1),1);


			if (emailList.length === 1){
				emailList[0].showMultipleRows = false;
			}
			updateEmailHeadings(emailList);
			this.model.lens('emailAddresses').set(emailList);
			this.setupAnotherEmailHandler();
		},

		addMoneyTransferProfileEmailAddress: function(){
			var emailAddressesLenBeforeAdd = this.emailAddresses.length;
			if (emailAddressesLenBeforeAdd < 5){
				var emailList = this.model.lens('emailAddresses').get();


				var isMultiple = (emailAddressesLenBeforeAdd>=1);

				if(emailAddressesLenBeforeAdd===1) {
					var email0 = emailList[0];
					email0.showMultipleRows = isMultiple;
					if(email0&&email0.primaryDesignation&&email0.primaryDesignation===true) {
					$('#primaryDesignation0').attr('checked','checked');
				}
				}

				var newEmailAddress = {id:'0', emailAddress:'',
					primaryDesignation:false,
					index: emailAddressesLenBeforeAdd,
					isAddEnabled:false, showMultipleRows:isMultiple,
					emailHeading:getEmailHeading(emailAddressesLenBeforeAdd+1)};

				if (this.model.lens('isNoEmailInCis').get()===false) {
					newEmailAddress.options = context.dataTransform.copyOptions(this.model.lens('emailOptions').get());
				}

				emailList.push(newEmailAddress);

				this.model.lens('emailAddresses').set(emailList);
			}
			this.setupAnotherEmailHandler();
		},

		setupAnotherEmailHandler: function(){
			var showHide = (this.emailAddresses.length < 5)? 'show' : 'hide';
            this.output.emit('state', {
                target: this,
                value: 'showHideSetupAnotherEmail',
                showHideOption: {option: showHide}
            });
		},

		agreementCheckboxClicked: function(inputData){
			var agreementCheckboxChecked = inputData.domEvent.target.checked;
			this.model.lens('quickpayEnrollmentLegalAcceptance').set(agreementCheckboxChecked);
			var enableDisable = (agreementCheckboxChecked)? 'enable' : 'disable';
            this.output.emit('state', {
                target: this,
                value: 'enableDisableNextButton',
                enableDisableOption: {option: enableDisable}
            });
		},

		designatePrimaryEmailAddress: function(inputData){
			var selection = inputData.dataPath.substr(inputData.dataPath.length-1);
			var emailList = this.model.lens('emailAddresses').get();
			for (var i = 0; i < emailList.length; i++) {
				emailList[i].primaryDesignation = (i == selection);
			}
			updateEmailHeadings(emailList);
			this.model.lens('emailAddresses').set(emailList);
		},

		emailDropdownSelected: function(inputData){
			this.setupAnotherEmailHandler();

			var $theTargetEl = $(inputData.domEvent.target);
			var selOptVal = $theTargetEl.val();

			var emailAddressContext = null;

			if (inputData.dataPath == ''){
				emailAddressContext = inputData.context.emailAddresses[0];
			} else {
				emailAddressContext = inputData.context;
			}

			if(selOptVal&&selOptVal==='Add') {
				emailAddressContext.isAddEnabled = true;
				emailAddressContext.emailAddress = '';
				emailAddressContext.id = '0';
			}
			else if(selOptVal&&selOptVal.length>0){
				emailAddressContext.id = selOptVal;
				emailAddressContext.emailAddress = $theTargetEl.find('option:selected').text();
				emailAddressContext.isAddEnabled = false;
			}

			var options = emailAddressContext.options;
			var optionsSelectedId = '0';
			if(selOptVal&&selOptVal.length>0) {
				optionsSelectedId = selOptVal;
			}
			context.dataTransform.updateEmailOptionsDropdownSelectedById(options, optionsSelectedId);
		},

		mobileDropdownSelected: function(inputData){
			var $theTargetEl = $(inputData.domEvent.target);
			var selOptVal = $theTargetEl.val();
			var mobileContext = null;
			var showHide = (selOptVal === '0' || selOptVal === 'Add')? 'hide' : 'show';

			showTcpaDisclosure.call(this, showHide);

			if (inputData.dataPath == ''){
				mobileContext = inputData.context.phoneNumbers[0];
			} else {
				mobileContext = inputData.context;
			}

			if(selOptVal&&selOptVal==='Add') {
				mobileContext.isAddEnabled = true;
				mobileContext.phoneNumber = '';
				mobileContext.id = '0';
			}
			else if(selOptVal&&selOptVal.length>0){
				mobileContext.id = selOptVal;
				mobileContext.phoneNumber = $theTargetEl.find('option:selected').text();
				mobileContext.isAddEnabled = false;
			}

			var options = mobileContext.options;
			var optionsSelectedId = '0';
			if(selOptVal&&selOptVal.length>0) {
				optionsSelectedId = selOptVal;
			}

			context.dataTransform.updateEmailOptionsDropdownSelectedById(options, optionsSelectedId);
		},

		mobilePhoneEntered: function(inputData){
			// tcpa disclosure
			var phoneNumber = $("input[type='text'][name='phone_number1']").val() + $("input[type='text'][name='phone_number2']").val() + $("input[type='text'][name='phone_number3']").val();
			var showHide = (phoneNumber.length === 0)? 'hide' : 'show';
			showTcpaDisclosure.call(this, showHide);

			// move cursor to next textbox
			var $phoneTextbox = $(inputData.domEvent.target);
			var phoneTextboxIndex = $phoneTextbox[0].name.substring($phoneTextbox[0].name.length-1);
			var phoneValue = $phoneTextbox.val();

			// change focus to next phone textbox if its first or second textbox
			if (phoneTextboxIndex === '1' || phoneTextboxIndex === '2') {
				if (phoneValue.length === 3){
					// get next phone box
					var nextPhoneName = $phoneTextbox[0].name.substring(0, $phoneTextbox[0].name.length-1) + (parseInt($phoneTextbox[0].name.substring($phoneTextbox[0].name.length-1))+1);
					var nextPhoneTextbox = $("input[name='" + nextPhoneName + "']");
					nextPhoneTextbox.focus();
				}
			}
		},

		validateInputForm: function(){
			// format phone
			populatePhoneNumber.call(this);
			var isAgreementSelected = this.model.lens('quickpayEnrollmentLegalAcceptance').get();
			if(!isAgreementSelected) {
				return false;
			}
			/*

			// SAVE FOR SPRINT REQUIRING ENROLL FORM INPUT VALIDATION
			var emailAddresses = this.model.lens('emailAddresses').get();
			var hasNonZeroEmailAddressElements = emailAddresses&&emailAddresses.length>0;

			if(!hasNonZeroEmailAddressElements) {
				return false;
			}

			var firstOnlyEmailAddress = hasNonZeroEmailAddressElements&&emailAddresses.length===1 ? emailAddresses[0] : null;
			//Only covers first email if it is the only one.
			var isFirstOnlyEmailValid = firstOnlyEmailAddress===null||(firstOnlyEmailAddress ? isEmailAddressValid(firstOnlyEmailAddress) : false);

			if(!isFirstOnlyEmailValid) {
				return false;
			}

			var primaryEmailAddress =
				hasNonZeroEmailAddressElements&&emailAddresses.length>1 ? getPrimarySelectedEmail(emailAddresses) : null;

			//Primary must be selected for more than one email input.
			//Otherwise, primary is not required on first only email address.
			//getEnrollmentAddServiceInput function assumes first one is primary so no need.
			var isPrimarySelectedValid = primaryEmailAddress!==null;

			if(!isPrimarySelectedValid) {
				return false;
			}

			var isPrimaryEmailValid = (primaryEmailAddress ? isEmailAddressValid(primaryEmailAddress) : false);
			if(!isPrimaryEmailValid) {
				return false;
			}

			var isOtherEmailsAddedButNotEnt =
				emailAddresses.length>1&&isOtherEmailsAddedButNotEntered(emailAddresses);

			if(isOtherEmailsAddedButNotEnt) {
				return false;
			}
			*/


			return true;
		},

		updateMoneyTransferProfileEmailAddress: function(){

		},

		addPhoneNumber: function(){

		},

		updateEmailAddress: function(){

		},

		resendVerificationCode: function(){
			var input = {};
			input.contactId = arguments[0];
			context.qpServices.qpApi['quickpay.enrollment.resendcode'](input).then(function(serviceResponse){
				// alert(JSON.stringify(serviceResponse));
		    }.bind(this));
		},

		validateVerificationCode: function(inputValue){
			this.output.emit('verifyValue', {
            	value: inputValue
        	});
		},
		triggerVerifyService: triggerVerifyService,
		manageMyMoneyTransferProfile: function(){

		}
	};
});
