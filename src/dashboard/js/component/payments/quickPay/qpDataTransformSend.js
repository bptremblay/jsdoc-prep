define(function(require){

	var UIElements = require('dashboard/lib/quickPay/qpInputElements'),
		formatUtility = require('dashboard/lib/quickPay/qpFormatUtility'),
		dynamicContentUtil = require('common/utility/dynamicContentUtil'),
		contentUtil = require('dashboard/lib/common/contentUtil');

	this.context = null;

	var getRecipientDropdown = function(id, label, qpRecipientListServiceResult, value){
		var recipientOptions = UIElements.enumInputElementUtility.dataTransformToEnumValuesArray(
			qpRecipientListServiceResult.recipients, this.context.model.lens('sendComponent.payee_name_placeholder').get());

		recipientOptions[recipientOptions.length] =
			UIElements.enumInputElementUtility.createEnumValueFromIdAndLabel(101, '-------------------------------------');
		recipientOptions[recipientOptions.length] =
			UIElements.enumInputElementUtility.createEnumValueFromIdAndLabel(102, 	'Add a recipient');

		var defaultValue = '';
		if(value) {
			defaultValue = value;
		}
		var recipientDD = new UIElements.DropDown(id, label, '', defaultValue, recipientOptions);

        var recipientUICInputElement = recipientDD.getUICInputElement();

        return recipientUICInputElement;
	};

	var getRecipient = function(isReadOnlyEl, id, label, qpRecipientListServiceResult, displayValue, selectedIdValue) {

		if(isReadOnlyEl&&isReadOnlyEl===true) {
			return UIElements.readOnlyValueUtility.getUICDisplayElement(id, label, displayValue, true);//last flag is for input hidden not just read only
		}
		return getRecipientDropdown(id, label, qpRecipientListServiceResult);
	};

	var getAccountDropdown = function(qpAddOptionsListServiceResult, account){
		var labelSuffixFunc = function(svcDataObj) {

			return formatUtility.formatCurrencyUtility.formatCurrency(svcDataObj.availableBalance,2,',','-','$','--');
		};

		var defAcct = account ? account : '';
		return UIElements.enumInputElementUtility.dataTransformToDropDownsUICInputElement(
			qpAddOptionsListServiceResult.fundingAccounts,'Select account', 'fundingAccountId', this.context.model.lens('sendComponent.funding_account_display_name_with_balance_label').get(), '', defAcct, labelSuffixFunc);
 	};

	var getDefaultAccount = function(qpAddOptionsListServiceResult){

		var defaultAcc = null;
		try {
			defaultAcc = getContext().context.util.object.find(qpAddOptionsListServiceResult.fundingAccounts, { defaultAccount: true});
			defaultAccount = defaultAcc.id+'@'+defaultAcc.label;

		}
		catch(ee) {
			var e = ee;
		}
		var defaultAccount = '';

		for (var i = 0; i < qpAddOptionsListServiceResult.fundingAccounts.length; i++) {
			if (qpAddOptionsListServiceResult.fundingAccounts[i].defaultAccount){
				defaultAccount = qpAddOptionsListServiceResult.fundingAccounts[i].id+'@'+qpAddOptionsListServiceResult.fundingAccounts[i].label;
				break;
			}
		}

		return defaultAccount;
	};

	var getTokenDropdown = function(id, label){
		var tokenEnumValues = [ UIElements.enumInputElementUtility.createEnumValueFromIdAndLabel(0,this.context.model.lens('sendComponent.payee_contact_info_placeholder').get()) ];
		var tokenDropDown = new UIElements.DropDown(id, label, '', '', tokenEnumValues, true );

        var tokenUICInputElement = tokenDropDown.getUICInputElement();

        return tokenUICInputElement;
	};

	var getToken = function(isReadOnlyEl, id, label, displayValue) {

		if(isReadOnlyEl&&isReadOnlyEl===true) {
			return UIElements.readOnlyValueUtility.getUICDisplayElement(id, label, displayValue, true);//last flag is for input hidden not just read only
		}
		return getTokenDropdown(id, label);
	};

	var getSendOn = function(isReadOnlyEl, id, label, value) {

		if(isReadOnlyEl&&isReadOnlyEl===true) {
			return UIElements.readOnlyValueUtility.getUICDisplayElement(id, label, value, true);//last flag is for input hidden not just read only
		}
		return (new UIElements.TextBox(id, label)).getUICInputElement();

	};

	var getFormLinks = function(){
		var formLinks = {};

		formLinks = {
			items: [
				{
				'label': this.context.model.lens('sendComponent.manage_money_transfer_contact_navigation').get(),
				'url' : '#'
				},
				{
				'label': this.context.model.lens('sendComponent.add_money_transfer_contact_navigation').get(),
				'url' : '#'
				},
				{
				'label': this.context.model.lens('sendComponent.manage_my_money_transfer_profile_navigation').get(),
				'url' : '#'
				},
			]
		};

		return formLinks;
	};

	var setContext = function(context){
		this.context = context;
	};

	var getContext = function(){
		return this.context;
	};

	var getFrequencyDropdown = function(){
		var frequencyOptions = [];

		var frequency = contentUtil.getList('transaction_frequency');
		for (var i = 0; i < frequency.length; i++) {
			frequencyOptions[frequencyOptions.length] = UIElements.enumInputElementUtility.createEnumValue(frequency[i].code, frequency[i].description);
		}

        return (new UIElements.DropDown('transaction_frequency_option', this.context.model.lens('sendComponent.transaction_frequency_option_label').get(), '', 'MONTHLY', frequencyOptions)).getUICInputElement();
	};

	var getMonthDateOptions = function(selectedValue){
		var dayOfMonthOptions = [];

		var monthDate = contentUtil.getList('day_of_month');
		for (var i = 0; i < monthDate.length; i++) {
			dayOfMonthOptions[dayOfMonthOptions.length] = UIElements.enumInputElementUtility.createEnumValue(monthDate[i].code, monthDate[i].description);
			if (selectedValue && selectedValue === monthDate[i].code){
				dayOfMonthOptions[dayOfMonthOptions.length-1].selected = true;
			}
		}

		return dayOfMonthOptions;
	};

	var getWeekDaysOptions = function(){
		var weekDaysOptions = [];

		var weekDays = contentUtil.getList('day_of_week');
		for (var i = 0; i < weekDays.length; i++) {
			weekDaysOptions[weekDaysOptions.length] = UIElements.enumInputElementUtility.createEnumValue(weekDays[i].code, weekDays[i].description);
		}

		return weekDaysOptions;
	};

	var getMonthOptions = function(){
		var monthOptions = [];

		var month = contentUtil.getList('month');
		for (var i = 0; i < month.length; i++) {
			monthOptions[monthOptions.length] = UIElements.enumInputElementUtility.createEnumValue(month[i].code, month[i].description);
		}

		return monthOptions;
	};

	var getNotifyOnDropdowns = function(viewModel){
        viewModel.notifyOnSingleDropdown1 = (new UIElements.DropDown('notify_on_single_option1', this.context.model.lens('sendComponent.transaction_notification_option_label').get(), '', 'ONE', getMonthDateOptions())).getUICInputElement();
        viewModel.notifyOnSingleDropdown1.prompt = dynamicContentUtil.dynamicContent.get(this.context.components.sendComponent, 'transaction_notification_option_advisory.MONTHLY', {});
        viewModel.notifyOnSingleDropdown1.info = true;

        viewModel.notifyOnMultiDropdown1 = (new UIElements.DropDown('notify_on_multi_option1', this.context.model.lens('sendComponent.transaction_notification_option_label').get(), '', '', [{label:'--', value:'0'}])).getUICInputElement();
        viewModel.notifyOnMultiDropdown2 = (new UIElements.DropDown('notify_on_multi_option2', 'and', '', '', [{label:'--', value:'0'}])).getUICInputElement();
        viewModel.notifyOnMultiDropdown2.prompt = dynamicContentUtil.dynamicContent.get(this.context.components.sendComponent, 'transaction_notification_option_advisory.TWICE_MONTHLY', {});
        viewModel.notifyOnMultiDropdown1.info = true;
	};

	var getDurationUIElements = function(){
		return {
			'label': this.context.model.lens('sendComponent.transaction_duration_header').get(),
	        'inputs': [
	            {
	                'radio': {
	                    'name': 'transaction_duration',
	                    'options': [
	                        {
	                            'value': '1',
	                            'selected': true,
	                            label: this.context.model.lens('sendComponent.transaction_duration_no_limit_label').get()
	                        },
	                        {
	                            'value': '2',
	                            'label': this.context.model.lens('sendComponent.transaction_duration_occurrences_label').get()
	                        }
	                    ]
	                },
	            },
	            {
                    'text': {
                        'id': 'transaction_duration_occurrences',
						'disabled': true
                    }
	        	}]
		};
	};

	var getDropdownViewModel = function(id, label, selectedValue, options){
		return (new UIElements.DropDown(id, label, '', selectedValue, options)).getUICInputElement();
	};

	var getSendOnDateInput = function(sendOnValue) {

		var sendOnDateInput = (new UIElements.DateInput('transactionNotificationDate',
				getContext().model.lens('sendComponent.send_money_due_date_label').get(),
				'', sendOnValue ) ).getUICInputElement();
		sendOnDateInput.info = true;
		return sendOnDateInput;
	};

	return {
		init: function(context){
			setContext(context);
		},

		getSendOnDateInput: getSendOnDateInput,

		getSendInputViewModel: function(qpRecipientListServiceResult,
			qpAddOptionsListServiceResult, data){
			var viewModel = {};

			var isRecipientRO = false;
			var recValue = undefined;
			var recNickname = undefined;
			var recName = undefined;

			var isTokenRO = false;
			var tokenId = undefined;
			var tokenValue = undefined;
			var contactType = null;

			var isDateRO = false;

			if(data.isFromSolicitedSendToDo===true&&!qpRecipientListServiceResult&&qpAddOptionsListServiceResult) {

				isRecipientRO = true;
				isTokenRO = true;
				isDateRO = true;

				var recipientId = null;
				if(qpAddOptionsListServiceResult.recipientDetail) {
					var recDetail = qpAddOptionsListServiceResult.recipientDetail;

					var name = recDetail ? (recDetail.nickname ? recDetail.nickname : recDetail.name) : '';
					recipientId = recDetail.id;
					recValue = name;
					recNickname = recDetail.nickname;
					recName = recDetail.name;

					var emailContact = recDetail && recDetail.contacts ?
					//It should return only one.
					//If it does not, API has a bug.
					//BUG: Though , it does not seem to be returning the contact with same tokenId.
					(recDetail.contacts.length>0 ? recDetail.contacts[0] :
						null
						)
					/*
						( data&&data.tokenId ?
							context.context.util.object.find(
								recDetail.contacts, { id: data.tokenId })
							:
							//if data.tokenId is not given, then contact returned should be
							//the token id one, token id detected on action item given by request.
							( recDetail.contacts.length==1 ?
								recDetail.contacts[0] :
								context.context.util.object.find(
									recDetail.contacts, { defaultContact: true } )
							)
						)
					*/
					: null;
					tokenValue = emailContact ? emailContact.address : '';
					tokenId = emailContact ? emailContact.id : '';
					contactType = emailContact ? emailContact.type : null;
				}
				else {
					recValue = data.recipientName;
					recName = data.recipientName;
					recNickname = null;
					recipientId = 0;
					tokenId = data.tokenId;
					tokenValue = null;
				}

				viewModel.payeeId = recipientId + '@' + recValue;
				viewModel.payeeNickname = recNickname;
				viewModel.payeeName = recName;
				viewModel.payeeContactInfoId = tokenId + '@' + tokenValue;
				viewModel.contactType = contactType;
				viewModel.contactAddress = tokenValue;

				if(qpAddOptionsListServiceResult.requestDetail) {
					var requestDetail = qpAddOptionsListServiceResult.requestDetail;
					//This formatCurrency call is the default one because we don't need $ sign in it. The money textbox css content has the $ sign.
					viewModel.amount = formatUtility.formatCurrencyUtility.formatCurrency(requestDetail.amount);

					viewModel.dateRequestedBy = requestDetail.dueDate ? requestDetail.dueDate : 'None';
					viewModel.dateRequestedByField =
						UIElements.readOnlyValueUtility.getUICDisplayElement(
							'dateRequestedBy', 'Date requested by',
							viewModel.dateRequestedBy, true);//last flag is for input hidden not just read only
					viewModel.requestId = requestDetail.requestId;
				}
				viewModel.isShowRepeatingPayment = false;
			}
			else {
				viewModel.isShowRepeatingPayment = true;
			}

			viewModel.account = getDefaultAccount(qpAddOptionsListServiceResult);

			var svcDateSendOn = qpAddOptionsListServiceResult.sendOnDate;
			var sendOnDashedForDatePicker = null;

			//Check for today
			if(!svcDateSendOn ||
				(formatUtility.formatDateUtility.formatDate(new Date()) ===
					formatUtility.formatDateUtility.formatServiceDate(svcDateSendOn) ) ) {
				sendOnDashedForDatePicker = 'Today';
			}
			else {
				sendOnDashedForDatePicker =
					formatUtility.formatDateUtility.formatServiceDateToDashedYearMonthDay(
						svcDateSendOn);
			}

			viewModel.sendOn = sendOnDashedForDatePicker;

			//This is the way to show Oct. 20, 2014
			//formatUtility.formatDateUtility.formateDateMonthDayYear(
			//	qpAddOptionsListServiceResult.sendOnDate)

			viewModel.recipientDropdown = getRecipient(isRecipientRO, 'payeeId',
					getContext().model.lens('sendComponent.payee_name_label').get(),
					qpRecipientListServiceResult, recValue);
			viewModel.tokenDropdown = getToken(isTokenRO, 'payeeContactInfoId',
				getContext().model.lens('sendComponent.payee_contact_info_label').get(), tokenValue);
			viewModel.tokenDropdown.info = true;
			viewModel.accountDropdown = getAccountDropdown(qpAddOptionsListServiceResult,
				viewModel.account);

			//amount value is set automatically from component model lens setting
			viewModel.amountTextbox = (new UIElements.MoneyInput('transactionAmount',
				getContext().model.lens('sendComponent.transaction_amount_label').get(),
					'', ( viewModel.amount ? viewModel.amount : '' ) ) ).getUICInputElement();
			viewModel.sendOnDateInput = getSendOnDateInput( viewModel.sendOn );
			viewModel.sendOnDateInput.info = true;
			viewModel.memoTextbox = (new UIElements.TextBox('memo',
				getContext().model.lens('sendComponent.memo_label').get())).getUICInputElement();
			viewModel.memoTextbox.optional = true;

			viewModel.isRepeatingPayment = false;
			viewModel.frequencyDropdown = getFrequencyDropdown();

			getNotifyOnDropdowns(viewModel);
			viewModel.notifyOnSingleDropdown = true;
			//viewModel.notifyOnSingleDropdown.info = true;
	        viewModel.firstNotificationDropdown = (new UIElements.DropDown('first_notification_date', getContext().model.lens('sendComponent.transaction_notification_recurring_date_label').get(), '', '', [{label:'--', value:'0'}])).getUICInputElement();
	        viewModel.firstNotificationDropdown.info = true;
			viewModel.durationUIElements = getDurationUIElements();
			viewModel.actions = UIElements.readOnlyValueUtility.getUICActionElementsPair('send_cancel_button', getContext().model.lens('sendComponent.cancel_label').get(), 'send_next_button', getContext().model.lens('sendComponent.next_label').get());
			viewModel.formlinks = getFormLinks();
			viewModel.onLabel = getContext().model.lens('sendComponent.on_label').get();
			viewModel.offLabel = getContext().model.lens('sendComponent.off_label').get();
			//Info icon
			viewModel.moneyTransferContactInfoHelpMessage = getContext().model.lens('sendComponent.money_transfer_contact_info_help_message').get();
			viewModel.transactionNotificationDateHelpMessage = getContext().model.lens('sendComponent.transaction_notification_date_help_message').get();
			viewModel.transactionNotificationRecurringDateHelpMessage = getContext().model.lens('sendComponent.transaction_notification_recurring_date_help_message').get();
			viewModel.transactionNotificationOptionHelpMessage = getContext().model.lens('sendComponent.transaction_notification_option_help_message').get();

			return viewModel;
		},
		getNotificationScheduleViewModel: function(qpDatePreviewListServiceResult, amount, paymentsToShow){
			var viewModel = {}, transactionNotifications = [];
				  for(var i=0; i<paymentsToShow; i++) {
						transactionNotifications.push(
							{transactionNotificationDate: formatUtility.formatDateUtility.formateDateMonthDayYear(qpDatePreviewListServiceResult.scheduledDates[i]),
						     transactionNotificationAmount: formatUtility.formatCurrencyUtility.formatCurrency(amount,2,',','-','$','--')});
				}
  				viewModel.transactionNotifications = transactionNotifications;
				viewModel.transactionNotifications.showNotificationDates = getContext().model.lens('notificationScheduleComponent.transactionNotifications.showNotificationDates').get();
				viewModel.transactionNotifications.passedSendInput = getContext().model.lens('notificationScheduleComponent.transactionNotifications.passedSendInput').get();
			return viewModel;
		},

		getSendVerifyViewModel: function(data){
			var viewModel = {};

			viewModel.formId = data.formId;
			viewModel.sendTo = UIElements.readOnlyValueUtility.getUICDisplayElement('sendTo', getContext().model.lens('sendComponent.payee_name_label').get(), data.recipientName);
			viewModel.email = UIElements.readOnlyValueUtility.getUICDisplayElement('email', getContext().model.lens('sendComponent.payee_contact_info_label').get(), data.contactAddress);
			viewModel.payFrom = UIElements.readOnlyValueUtility.getUICDisplayElement('payFrom', getContext().model.lens('sendComponent.funding_account_display_name_with_balance_label').get(), data.fundingAccountName);
			viewModel.amount = UIElements.readOnlyValueUtility.getUICDisplayElement('amount', getContext().model.lens('sendComponent.transaction_amount_label').get(), formatUtility.formatCurrencyUtility.formatCurrency(data.amount,2,',','-','$','--'));
			viewModel.memo = UIElements.readOnlyValueUtility.getUICDisplayElement('memo', getContext().model.lens('sendComponent.memo_label').get(), data.memo? data.memo : 'None');
			viewModel.transactionRecurring = (getContext().model.lens('sendComponent.transactionRecurring').get() === 'true')? true : false;

			var isFromSolicitedSendToDo = getContext().model.lens('sendComponent.isFromSolicitedSendToDo').get();
			if(isFromSolicitedSendToDo==='true'||isFromSolicitedSendToDo === true) {
				viewModel.dateRequestedByField =
						UIElements.readOnlyValueUtility.getUICDisplayElement(
							'dateRequestedBy', 'Date requested by',
							getContext().model.lens('sendComponent.dateRequestedBy').get(),
							true);//last flag is for input hidden not just read only
			}

			if (getContext().model.lens('sendComponent.transactionRecurring').get() === 'true'){
				viewModel.frequency = UIElements.readOnlyValueUtility.getUICDisplayElement('frequency', getContext().model.lens('sendComponent.transaction_frequency_option_label').get(), contentUtil.getValue('transaction_frequency', data.model.frequency));
				viewModel.notifyOn = UIElements.readOnlyValueUtility.getUICDisplayElement('notifyOn', getContext().model.lens('sendComponent.transaction_notification_option_label').get(), getContext().components.sendComponent.getNotifyOnPromptWithSelection());
				viewModel.firstNotification = UIElements.readOnlyValueUtility.getUICDisplayElement('firstNotification', getContext().model.lens('sendComponent.transaction_notification_recurring_date_label').get(), data.sendOnDate);
				viewModel.duration = UIElements.readOnlyValueUtility.getUICDisplayElement('duration', getContext().model.lens('sendComponent.transaction_duration_header').get(), getContext().model.lens('sendComponent.transactionDuration').get() === '1'? 'No ending date' : data.model.numberOfPayments + ' Payment(s)');
			} else {
				viewModel.sendOn = UIElements.readOnlyValueUtility.getUICDisplayElement('sendOn', getContext().model.lens('sendComponent.send_money_due_date_label').get(), data.sendOnDate);
			}

			viewModel.actions = [UIElements.readOnlyValueUtility.getUICActionElement('send_previous_button', getContext().model.lens('sendComponent.previous_label').get()),
				UIElements.readOnlyValueUtility.getUICActionElement('send_cancel_button', getContext().model.lens('sendComponent.cancel_label').get()),
				UIElements.readOnlyValueUtility.getUICActionElement('send_next_button', getContext().model.lens('sendComponent.confirm_send_money_label').get(), true)];
			viewModel.verifySendMoneyAdvisory = getContext().model.lens('sendComponent.verify_send_money_advisory').get();
			return viewModel;
		},

		getSendConfirmViewModel: function(data){
			var viewModel = {};

			viewModel.success = (data.statusCode)? false : true;
			viewModel.sendTo = UIElements.readOnlyValueUtility.getUICDisplayElement('sendTo', getContext().model.lens('sendComponent.payee_name_label').get(), data.recipientName);
			viewModel.email = UIElements.readOnlyValueUtility.getUICDisplayElement('email', getContext().model.lens('sendComponent.payee_contact_info_label').get(), data.contactAddress);
			viewModel.payFrom = UIElements.readOnlyValueUtility.getUICDisplayElement('payFrom', getContext().model.lens('sendComponent.funding_account_display_name_with_balance_label').get(), data.fundingAccountName);
			viewModel.amount = UIElements.readOnlyValueUtility.getUICDisplayElement('amount', getContext().model.lens('sendComponent.transaction_amount_label').get(), formatUtility.formatCurrencyUtility.formatCurrency(data.amount,2,',','-','$','--'));
			viewModel.memo = UIElements.readOnlyValueUtility.getUICDisplayElement('memo', getContext().model.lens('sendComponent.memo_label').get(), data.memo? data.memo : 'None');
			viewModel.transactionNumber = UIElements.readOnlyValueUtility.getUICDisplayElement('transactionNumber', getContext().model.lens('sendComponent.transaction_number_label').get(), data.paymentId);
			viewModel.expiryDate = data.expiryDate;
			viewModel.transactionRecurring = (getContext().model.lens('sendComponent.transactionRecurring').get() === 'true')? true : false;

			var isFromSolicitedSendToDo = getContext().model.lens('sendComponent.isFromSolicitedSendToDo').get();
			if(isFromSolicitedSendToDo==='true'||isFromSolicitedSendToDo === true) {
				viewModel.dateRequestedByField =
						UIElements.readOnlyValueUtility.getUICDisplayElement(
							'dateRequestedBy', 'Date requested by',
							getContext().model.lens('sendComponent.dateRequestedBy').get(),
							true);//last flag is for input hidden not just read only
			}

			if (getContext().model.lens('sendComponent.transactionRecurring').get() === 'true'){
				viewModel.frequency = UIElements.readOnlyValueUtility.getUICDisplayElement('frequency', getContext().model.lens('sendComponent.transaction_frequency_option_label').get(), contentUtil.getValue('transaction_frequency', data.model.frequency));
				viewModel.notifyOn = UIElements.readOnlyValueUtility.getUICDisplayElement('notifyOn', getContext().model.lens('sendComponent.transaction_notification_option_label').get(), getContext().components.sendComponent.getNotifyOnPromptWithSelection());
				viewModel.firstNotification = UIElements.readOnlyValueUtility.getUICDisplayElement('firstNotification', getContext().model.lens('sendComponent.transaction_notification_recurring_date_label').get(), data.sendOnDate);
				viewModel.duration = UIElements.readOnlyValueUtility.getUICDisplayElement('duration', getContext().model.lens('sendComponent.transaction_duration_header').get(), getContext().model.lens('sendComponent.transactionDuration').get() === '1'? 'No ending date' : data.model.numberOfPayments + ' Payment(s)');
			} else {
				viewModel.sendOn = UIElements.readOnlyValueUtility.getUICDisplayElement('sendOn', getContext().model.lens('sendComponent.send_money_due_date_label').get(), data.sendOnDate);
			}

			viewModel.actions = UIElements.readOnlyValueUtility.getUICActionElementsPair('send_more_money_button', getContext().model.lens('sendComponent.send_more_money_label').get(),'send_close_button', getContext().model.lens('sendComponent.exit_label').get());

			var sendComponent = getContext().components.sendComponent;
			dynamicContentUtil.dynamicContent.setForBinding(sendComponent, 'confirm_send_money_message', 'confirm_send_money_message', {
				recipientName: data.recipientName,
				amount: formatUtility.formatCurrencyUtility.formatCurrency(data.amount,2,',','-','$','--')
			});
			viewModel.confirmSendMoneyMessage = sendComponent.confirmSendMoneyMessage;

			dynamicContentUtil.dynamicContent.setForBinding(sendComponent, 'confirm_send_money_advisory', 'confirm_send_money_advisory', {
				recipientName: data.recipientName,
				expiryDate: data.expiryDate
			});
			viewModel.confirmSendMoneyAdvisory = sendComponent.confirmSendMoneyAdvisory;

			return viewModel;
		},

		getSendOverlayViewModel : function(data) {
			var viewModel = {};
			var sendComponent = getContext().components.sendComponent;

			dynamicContentUtil.dynamicContent.setForBinding(sendComponent, 'transaction_notification_confirmation_message', 'transaction_notification_confirmation_message', {
				transactionAmount: data.amount,
				 recipientTitle : data.recipientName,
				 sendOnTitle : formatUtility.formatDateUtility.formateDateMonthDayYear(data.sendOnDate)
			});

			viewModel.message  = sendComponent.transactionNotificationConfirmationMessage;

			return viewModel;
		},
		addTokenActions: function(tokenData, tokenOptions, tokens){
			var addEditPhoneLabel = 'Add', addEditEmailLabel = 'Add', emailCount = 0;

			for (var i = 0; i < tokens.length; i++) {
				if (tokens[i].type === 'PHONE'){
					addEditPhoneLabel = 'Edit';
					break;
				}
			}

			for (var j = 0; j < tokens.length; j++) {
				if (tokens[j].type === 'EMAIL'){
					++emailCount;
				}
			}

			addEditEmailLabel = (emailCount >= 5)? 'Edit' : 'Add';
			tokenData.push({key:101, value:'-------------------------------------', default:false});
			tokenData.push({key:102, value:addEditEmailLabel + ' email address', default:false});
			tokenData.push({key:103, value:addEditPhoneLabel + ' mobile number', default:false});

			tokenOptions['101@-------------------------------------'] = '-------------------------------------';
			tokenOptions['102@' + addEditEmailLabel + ' email address'] = addEditEmailLabel + ' email address';
			tokenOptions['103@' + addEditPhoneLabel + ' mobile number'] = addEditPhoneLabel + ' mobile number';
		},

		getMonthDateOptions: getMonthDateOptions,
		getWeekDaysOptions: getWeekDaysOptions,
		getMonthOptions: getMonthOptions,
		getDropdownViewModel: getDropdownViewModel
	};
});
