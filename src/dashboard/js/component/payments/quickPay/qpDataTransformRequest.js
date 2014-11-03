define(function(require){

	var UIElements = require('dashboard/lib/quickPay/qpInputElements'),
		formatUtility = require('dashboard/lib/quickPay/qpFormatUtility'),
		dynamicContentUtil = require('common/utility/dynamicContentUtil');

	this.context = null;

	var getRecipientDropdown = function(id, label, qpRecipientListServiceResult){
		var recipientOptions = UIElements.enumInputElementUtility.dataTransformToEnumValuesArray(
			qpRecipientListServiceResult.recipients, this.context.model.lens('requestComponent.payor_name_placeholder').get());

		recipientOptions[recipientOptions.length] =
			UIElements.enumInputElementUtility.createEnumValueFromIdAndLabel(101, '-------------------------------------');
		recipientOptions[recipientOptions.length] =
			UIElements.enumInputElementUtility.createEnumValueFromIdAndLabel(102, 	'Add a recipient');

		var recipientDD = new UIElements.DropDown(id, label, '', '', recipientOptions);

        var recipientUICInputElement = recipientDD.getUICInputElement();

        return recipientUICInputElement;
	};

	var getTokenDropdown = function(){
		var tokenEnumValues = [ UIElements.enumInputElementUtility.createEnumValueFromIdAndLabel(0,this.context.model.lens('requestComponent.payor_contact_info_placeholder').get()) ];
		var tokenDropDown = new UIElements.DropDown( 'payorContactInfoId',this.context.model.lens('requestComponent.payor_contact_info_label').get(), '', '', tokenEnumValues, true );

        var tokenUICInputElement = tokenDropDown.getUICInputElement();

        return tokenUICInputElement;
	};

	var getFormLinks = function(){
		var formLinks = {};

		formLinks = {
			items: [
				{
				'label': this.context.model.lens('requestComponent.manage_money_transfer_contact_navigation').get(),
				'url' : '#'
				},
				{
				'label': this.context.model.lens('requestComponent.add_money_transfer_contact_navigation').get(),
				'url' : '#'
				},
				{
				'label': this.context.model.lens('requestComponent.manage_my_money_transfer_profile_navigation').get(),
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

	// TODO: AT - Move this to inputElements
	var getRequestAmountTextBox = function(){
		return {
	        'id': 'amount_input',
	        'label': 'Amount',
	        'for': 'id_for_radio',
	        'inputs': [
	            {
	                'radio': {
	                    'name': 'transactionAmountDecisionMaker',
	                    'options': [
	                        {
	                            'value': '1',
	                            'selected': true
	                        }
	                    ]
	                },
	            },
	            {
                    'text': {
                        'id': 'transactionAmount',
                        'name': 'textAmount'
                    }
	        	}]
        };
	};

	// TODO: AT - Move this to inputElements
	var getRequestAmountOptionRadio = function(){
		return {
			'id':'amount_option_input',
				'inputs': {
					'radio': {
						'name': 'transactionAmountDecisionMaker',
							'options': [{
								'value':'2',
								'label' : this.context.model.lens('requestComponent.transaction_amount_decision_maker_label').get()
						}]
				}
			}
		};
	};

	return {
		init: function(context){
			setContext(context);
		},

		getRequestInputViewModel: function(qpRecipientListServiceResult){
			var viewModel = {};

			viewModel.recipientDropdown = getRecipientDropdown('payorId', getContext().model.lens('requestComponent.payor_name_label').get(), qpRecipientListServiceResult);
			viewModel.tokenDropdown = getTokenDropdown();
			viewModel.memoTextbox = (new UIElements.TextBox('memo', getContext().model.lens('requestComponent.memo_label').get())).getUICInputElement();
			viewModel.memoTextbox.optional = true;
			viewModel.amountTextbox = getRequestAmountTextBox();
	        viewModel.amountOptionRadio = getRequestAmountOptionRadio();
			viewModel.requestedByTextbox = (new UIElements.TextBox('requestMoneyDueDate', getContext().model.lens('requestComponent.request_money_due_date_label').get())).getUICInputElement();
			viewModel.requestedByTextbox.optional = true;

			viewModel.actions = UIElements.readOnlyValueUtility.getUICActionElementsPair('cancel_button', getContext().model.lens('requestComponent.cancel_label').get(), 'next_button', getContext().model.lens('requestComponent.next_label').get());
			viewModel.formlinks = getFormLinks();

			return viewModel;
		},

		getRequestVerifyViewModel: function(qpRequestValidateServiceResult){
			var viewModel = {};

			var amountTitle = (getContext().model.lens('requestComponent.transactionAmountDecisionMaker').get() === '2')? 'Recipient will see a request for $0.00': formatUtility.formatCurrencyUtility.formatCurrency(qpRequestValidateServiceResult.amount,2,',','-','$','--');
			viewModel.formId = qpRequestValidateServiceResult.formId;
			viewModel.requestMoneyFrom = UIElements.readOnlyValueUtility.getUICDisplayElement('requestMoneyFrom', getContext().model.lens('requestComponent.payor_name_label').get(), qpRequestValidateServiceResult.recipientName);
			viewModel.email = UIElements.readOnlyValueUtility.getUICDisplayElement('email', getContext().model.lens('requestComponent.payor_contact_info_label').get(), qpRequestValidateServiceResult.contactAddress);
			viewModel.amount = UIElements.readOnlyValueUtility.getUICDisplayElement('amount', getContext().model.lens('requestComponent.transaction_amount_label').get(), amountTitle);
			viewModel.requestedBy = UIElements.readOnlyValueUtility.getUICDisplayElement('requestedBy', getContext().model.lens('requestComponent.request_money_due_date_label').get(), qpRequestValidateServiceResult.requestedByDate? qpRequestValidateServiceResult.requestedByDate : 'None');
			viewModel.memo = UIElements.readOnlyValueUtility.getUICDisplayElement('memo', getContext().model.lens('requestComponent.memo_label').get(), qpRequestValidateServiceResult.memo? qpRequestValidateServiceResult.memo : 'None');
			viewModel.actions = [UIElements.readOnlyValueUtility.getUICActionElement('previous_button', getContext().model.lens('requestComponent.previous_label').get()),
				UIElements.readOnlyValueUtility.getUICActionElement('cancel_button', getContext().model.lens('requestComponent.cancel_label').get()),
				UIElements.readOnlyValueUtility.getUICActionElement('next_button', getContext().model.lens('requestComponent.request_money_label').get(), true)];

			return viewModel;
		},

		getRequestConfirmViewModel: function(qpRequestAddServiceResult){
			var viewModel = {};

			var amountTitle = (getContext().model.lens('requestComponent.transactionAmountDecisionMaker').get() === '2')? 'Recipient will see a request for $0.00': formatUtility.formatCurrencyUtility.formatCurrency(qpRequestAddServiceResult.amount,2,',','-','$','--');
			viewModel.success = (qpRequestAddServiceResult.status === 'SENT')? true : false;
			viewModel.requestMoneyFrom = UIElements.readOnlyValueUtility.getUICDisplayElement('requestMoneyFrom', getContext().model.lens('requestComponent.payor_name_label').get(), qpRequestAddServiceResult.recipientName);
			viewModel.email = UIElements.readOnlyValueUtility.getUICDisplayElement('email', getContext().model.lens('requestComponent.payor_contact_info_label').get(), qpRequestAddServiceResult.contactAddress);
			viewModel.memo = UIElements.readOnlyValueUtility.getUICDisplayElement('memo', getContext().model.lens('requestComponent.memo_label').get(), qpRequestAddServiceResult.memo? qpRequestAddServiceResult.memo : 'None');
			viewModel.amount = UIElements.readOnlyValueUtility.getUICDisplayElement('amount', getContext().model.lens('requestComponent.transaction_amount_label').get(), amountTitle);
			viewModel.requestedBy = UIElements.readOnlyValueUtility.getUICDisplayElement('requestedBy', getContext().model.lens('requestComponent.request_money_due_date_label').get(), qpRequestAddServiceResult.requestedByDate? qpRequestAddServiceResult.requestedByDate : 'None');
			viewModel.transactionNumber = UIElements.readOnlyValueUtility.getUICDisplayElement('transactionNumber', getContext().model.lens('requestComponent.transaction_number_label').get(), qpRequestAddServiceResult.requestId);
			viewModel.actions = UIElements.readOnlyValueUtility.getUICActionElementsPair('request_more_money_button', getContext().model.lens('requestComponent.request_more_money_label').get(),'close_button', getContext().model.lens('requestComponent.exit_label').get());
			viewModel.expiryDate = qpRequestAddServiceResult.expiryDate;

			var requestComponent = getContext().components.requestComponent;
			dynamicContentUtil.dynamicContent.setForBinding(requestComponent, 'confirm_request_money_advisory', 'confirm_request_money_advisory', {
				expiryDate: qpRequestAddServiceResult.expiryDate
			});
			viewModel.confirmRequestMoneyAdvisory = requestComponent.confirmRequestMoneyAdvisory;

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
		}
	};
});
