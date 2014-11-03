define(function(require){

	var UIElements = require('dashboard/lib/quickPay/qpInputElements'),
		formatUtility = require('dashboard/lib/quickPay/qpFormatUtility');

	this.context = null;

	var setContext = function(context){
		this.context = context;
	};

	var getContext = function(){
		return this.context;
	};

	var copyOptions = function(emailOptions) {
		var copyEmailOpts = [];
		var opt = null;
		for(var i=0;i<emailOptions.length;i++) {
			opt = emailOptions[i];
			copyEmailOpts.push({id:opt.id,title:opt.title,selected:opt.selected});
		}
		return copyEmailOpts;
	};

	return {
		init: function(context){
			setContext(context);
		},
		isMobileAdded: function(phoneNumbers) {
			if(phoneNumbers&&phoneNumbers.length&&phoneNumbers.length>0&&phoneNumbers[0]&&phoneNumbers[0].options&&phoneNumbers[0].options.length&&phoneNumbers[0].options.length>0) {

				var mobileOpt = null;
				var mobileOptions = phoneNumbers[0].options;
				for(var i=0;i<mobileOptions.length;i++) {
					mobileOpt = mobileOptions[i];
					if(mobileOpt.id=='Add'&&mobileOpt.selected===true) {
						return true;
					}
				}
			}
			return false;

		},
		getEnrollSetupViewModel: function(){
			var viewModel = {};

			viewModel.enrollmentMessage = getContext().model.lens('enrollComponent.quickpay_enrollment_message').get();
			viewModel.actions = UIElements.readOnlyValueUtility.getUICActionElementsPair('cancel_button', getContext().model.lens('enrollComponent.cancel_label').get(), 'setup_button', getContext().model.lens('enrollComponent.initate_quickpay_enrollment_label').get());

			return viewModel;
		},
		updateEmailOptionsDropdownSelectedById: function(emailOptions,selectedOptionId) {

			var emailOpt = null;
			for(var i=0;i<emailOptions.length;i++) {
				emailOpt = emailOptions[i];
				if(emailOpt.id==selectedOptionId) {
					emailOpt.selected = true;
				}
				else {
					emailOpt.selected = false;
				}
			}
		},
		copyOptions: copyOptions,
		getEnrollEntryViewModel: function(data){
			var viewModel = {}, emailOptions = [], mobileOptions = [];

			viewModel.quickpayEnrollmentLegalAcceptance = false;

			viewModel.showMultipleRows = false;
			viewModel.emailAddresses = [{id:'0', emailAddress:'',
				primaryDesignation:true,
				index:0,
				isAddEnabled:false, showMultipleRows:false,
				emailHeading:''}];
			viewModel.isNoEmailInCis = typeof(data.emails)==='undefined'||data.emails===null||
				(data.emails != null && data.emails.length <= 0);
			viewModel.isNoMobileInCis = typeof(data.mobiles)==='undefined'||data.mobiles===null||
				(data.mobiles != null && data.mobiles.length <= 0);

			// create email options
			emailOptions.push({id:'0', title:'Select email', selected:true});
			if (data.emails !== undefined){
				for (var i = 0; i < data.emails.length; i++) {
					emailOptions.push({id:data.emails[i].id, title:data.emails[i].contact});
				}
			}

			emailOptions.push({id:'Line1', title:'---------------------------'});
			emailOptions.push({id:'Add', title:'Add an email to this list'});
			viewModel.emailOptions = emailOptions;

			if(!viewModel.isNoEmailInCis) {
				viewModel.emailAddresses[0].options = copyOptions(viewModel.emailOptions);
			}

			viewModel.phoneNumbers = [{id:'0', phoneNumber:'',
						isAddEnabled:false}];

			// create mobile options
			mobileOptions.push({id:'0', title:'Select mobile number', selected:true});
			if (data.mobiles !== undefined){
				for (var j = 0; j < data.mobiles.length; j++) {
					mobileOptions.push({id:data.mobiles[j].id,
						title:formatUtility.formatPhoneUtility.formatPhone(data.mobiles[j].contact)});
				}
			}
			mobileOptions.push({id:'Line1', title:'---------------------------'});
			mobileOptions.push({id:'Add', title:'Add new mobile number'});
			viewModel.mobileOptions = mobileOptions;

			if(!viewModel.isNoMobileInCis) {
				viewModel.phoneNumbers[0].options = copyOptions(viewModel.mobileOptions);
			}

			return viewModel;
		},

		getEnrollVerifyViewModel: function(qpEnrollmentAddResults){
			var viewModel = {};
			var locClose = getContext().model.lens('enrollComponent.quickpay_pending_actions_message').get();
			var locNext = getContext().model.lens('enrollComponent.next_label').get();

			viewModel = this.getEnrollEnding(qpEnrollmentAddResults,true);
			viewModel.moreMessage = getContext().model.lens('enrollComponent.quickpay_pending_actions_header').get();
			viewModel.editInfoAction = {
				label: getContext().model.lens('enrollComponent.quickpay_pending_actions_navigation').get()
			};
			viewModel.actions =
			[ 	UIElements.readOnlyValueUtility.getUICActionElement('close_button', locClose, false),
			 	UIElements.readOnlyValueUtility.getUICActionElement('next_button', locNext, true, true) ];
			return viewModel;
		},

		getEnrollConfirmViewModel: function(qpEnrollmentConfirmResults){
			var viewModel = {};
			var locRequest = getContext().model.lens('enrollComponent.request_money_label').get();
			var locSend = getContext().model.lens('enrollComponent.send_money_label').get();
			viewModel = this.getEnrollEnding(qpEnrollmentConfirmResults,false);
			viewModel.editInfoAction = {};
			viewModel.moreMessage = getContext().model.lens('enrollComponent.quickpay_pending_actions_header').get();
			viewModel.editInfoAction.id = 'close_button';
			viewModel.editInfoAction.label = getContext().model.lens('enrollComponent.quickpay_pending_actions_message').get();
			viewModel.actions = UIElements.readOnlyValueUtility.getUICActionElementsPair('request_money_button', locRequest, 'send_money_button', locSend);
			return viewModel;
		},
		getEnrollEnding: function(resultSet,isVerify){
			var locEmail = getContext().model.lens('enrollComponent.email_address_label').get();
			var locMobil = getContext().model.lens('enrollComponent.phone_number_label').get();
			var viewModel ={}, tmpEmailPrimary = [];
			var tmpEmailOther = [],tmpMobile = [];
			var emails = resultSet.emails;
			var mobile = resultSet.mobile;
			var count = 0, x = 0;
			var emailsLength = emails.length;
			var emailLabel = '';

			//seperate primary email from more emails from mobile information.
			for (x=0; x < emailsLength; x++){
				if (emails[x].primary){
					tmpEmailPrimary[0] = this.getEnrollGetRow(false,true,isVerify,emails[x],locEmail);
				} else {
					emailLabel = locEmail + ' ' + (count+2);
					tmpEmailOther[count] = this.getEnrollGetRow(false,false,isVerify,emails[x],emailLabel) ;
					count++;
				}
			};

			if(mobile){
				tmpEmailOther[count] = this.getEnrollGetRow(true,false,isVerify,mobile,locMobil); //mobile information, always last in array
			}

			viewModel.contactEmails = tmpEmailPrimary; //one primary email
			viewModel.moreContacts = tmpEmailOther; // additional emails, including mobile info

			return viewModel;
		},
		getEnrollGetRow: function(isMobile,isPrimary,isVerify,emailObj,label){
			var locResend =  getContext().model.lens('enrollComponent.resend_verification_code_label').get();
			var locEdit = getContext().model.lens('enrollComponent.update_email_address_label').get();

			var tmpEmail = {};
			tmpEmail.label = label;

			tmpEmail.info = (isMobile)? formatUtility.formatPhoneUtility.formatPhone(emailObj.address) : emailObj.address;

			if (isVerify){ // if verifying then display rest of info
				tmpEmail.verified = false;

				if(!tmpEmail.actions){
					tmpEmail.actions = [];
				}
				if (isPrimary) { // only display if primary email
					tmpEmail.actions.push({label:locEdit, url:'#'});
				}

				tmpEmail.actions.push({label:locResend, url: emailObj.id});

				tmpEmail.code = {};
				tmpEmail.code.id = emailObj.id;
				tmpEmail.code.label = getContext().model.lens('enrollComponent.verification_code_label').get();
				tmpEmail.code.inputs = {};
				tmpEmail.code.inputs.text = {};
				tmpEmail.code.inputs.text.id = 'code_uuid';
			}
			return tmpEmail;

		}
	};
});
