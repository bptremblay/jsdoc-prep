define(function(require){

	var OptionsLookupMap = require('dashboard/lib/quickPay/qpOptionsLookupMap'),
		formatUtility = require('dashboard/lib/quickPay/qpFormatUtility');

	var context = null, validate = null;

	return {
		init: function() {
			context = this.settings.context;
			validate = this.settings.validate;
			context.dataTransform.init(this.settings.context);
		},

		initializeEntryForm: function(){
			context.model.lens('requestComponent.payorId').set('0@' + this.model.lens('payor_name_placeholder').get());
			context.model.lens('requestComponent.payorContactInfoId').set('0@' + this.model.lens('payor_contact_info_placeholder').get());
			context.model.lens('requestComponent.memo').set('');
			context.model.lens('requestComponent.transactionAmountDecisionMaker').set('1');
			context.model.lens('requestComponent.transactionAmount').set('');
			context.model.lens('requestComponent.requestMoneyDueDate').set('');
		},

		setUserSelection: function(){
			// set model for previous click
			this.model.lens('payorId').set(this.payorId);
			this.model.lens('payorContactInfoId').set(this.payorContactInfoId);
			this.model.lens('memo').set(this.memo);
			this.model.lens('transactionAmountDecisionMaker').set(this.transactionAmountDecisionMaker);
			this.model.lens('requestMoneyDueDate').set(this.requestMoneyDueDate);
			this.model.lens('transactionAmount').set(this.transactionAmount);
		},

 		loadEntry: function(data){
  		    context.qpServices.qpApi['quickpay.recipient.list']().then(function(qpRecipientListServiceResult){

				var requestInputForm = context.dataTransform.getRequestInputViewModel(qpRecipientListServiceResult);
				context.model.lens('requestComponent.requestInputForm').set(requestInputForm);

				context.controllerChannel.emit('renderRequestEntry');

		    }.bind(this));
 		},

		verifyRequestMoney: function(){

			// get form input
			var input = {};
			input.recipientId = this.payorId.substring(0, this.payorId.indexOf('@'));
			input.recipientName = this.payorId.substring(this.payorId.indexOf('@')+1);
			input.contactId = this.payorContactInfoId.substring(0, this.payorContactInfoId.indexOf('@'));
			input.memo = this.memo? this.memo : null;
			input.amount = (this.transactionAmount && this.transactionAmountDecisionMaker === '1')? this.transactionAmount : 0;
			input.requestedByDate = this.requestMoneyDueDate? this.requestMoneyDueDate: null;
			this.setUserSelection();

  		    // call request validate service
  		    context.qpServices.qpApi['quickpay.request.validate'](input).then(function(qpRequestValidateServiceResult){

				// send message to show verify page with response
				context.controllerChannel.emit('showRequestVerify', qpRequestValidateServiceResult);

  		    }.bind(this));
		},

		loadVerify: function(data){
			var requestVerifyForm = {};

			requestVerifyForm = context.dataTransform.getRequestVerifyViewModel(data);

			context.model.lens('requestComponent.formId').set(data.formId);
			context.model.lens('requestComponent.RequestVerifyForm').set(requestVerifyForm);

			context.controllerChannel.emit('renderRequestVerify');
		},

		confirmRequestMoney: function(){
			// get form input
			var input = {};
			input.formId = context.model.lens('requestComponent.formId').get();

  		    // call request add service
  		    context.qpServices.qpApi['quickpay.request.add'](input).then(function(qpRequestAddServiceResult){

				// send message to show confirm page with response
				context.controllerChannel.emit('showRequestConfirm', qpRequestAddServiceResult);

  		    }.bind(this));
		},

		loadConfirm: function(data){
			var requestConfirmForm = {};

			requestConfirmForm = context.dataTransform.getRequestConfirmViewModel(data);

			context.model.lens('requestComponent.requestConfirmForm').set(requestConfirmForm);

			context.controllerChannel.emit('renderRequestConfirm');
		},

		intiateRequestMoney: function(){
			context.controllerChannel.emit('showRequestEntry');
		},

		exitRequestMoney: function(){
			context.state('#/dashboard');
		},

		cancelRequestMoney: function(){
			context.state('#/dashboard');
		},

		requestMoreMoney: function(){
			context.controllerChannel.emit('showRequestEntry', {defaults: true});
		},

		sendMoney: function(){
			context.controllerChannel.emit('showSendEntry', {defaults: true});
		},

		requestMoneyTransferContactInfo: function(){
			var recipientId = 0;

			if(typeof(this.payorId)!=='undefined'&&this.payorId!==null&&
				this.payorId.length&&this.payorId.length>0&&this.payorId.indexOf){
				var atSignIndex = this.payorId.indexOf('@');

				if(atSignIndex>0) {
					recipientId = this.payorId.substring(0, atSignIndex);
				}

			}
			else {
				//log that it's not defined or a string
				//recipientId = 0;
			}

			var defaultSelectValueId = '0@' + this.model.lens('payor_contact_info_placeholder').get();

			if(recipientId==0) { //Purposely == --> if both string or number is 0.


				//$('#payorContactInfoId').addClass('classDis');
				var $tokenDD = $('#payorContactInfoId');

				$tokenDD.attr('disabled','disabled');
				$tokenDD.val(defaultSelectValueId);
			}

 			// get tokens for this recipient
			// TODO: list2 service returns recipient data, remove it when connecting to api
		    recipientId>0&&context.qpServices.qpApi['quickpay.addoptions.list2']({recipientId:recipientId}).then(function(qpAddOptionsListServiceResult){
				var tokenData = [];
				var tokenOptions = {defaultSelectValueId: this.model.lens('payor_contact_info_placeholder').get()};
				tokenData.push({key:0, value:this.model.lens('payor_contact_info_placeholder').get(), default:false});

				// populate token data
		    	for (var i = 0; i < qpAddOptionsListServiceResult.recipientDetail.contacts.length; i++) {
					tokenData.push({key:qpAddOptionsListServiceResult.recipientDetail.contacts[i].id, value:qpAddOptionsListServiceResult.recipientDetail.contacts[i].address, default:qpAddOptionsListServiceResult.recipientDetail.contacts[i].defaultContact});
					tokenOptions[qpAddOptionsListServiceResult.recipientDetail.contacts[i].id + '@' + qpAddOptionsListServiceResult.recipientDetail.contacts[i].address] = qpAddOptionsListServiceResult.recipientDetail.contacts[i].address;
		    	}

		    	// add token actions
		    	context.dataTransform.addTokenActions(tokenData, tokenOptions, qpAddOptionsListServiceResult.recipientDetail.contacts);

				var tokenLookup = new OptionsLookupMap(tokenOptions, '0', false, '0');
		        var tokenFilter =  {
		        	'label': this.model.lens('payor_contact_info_label').get(),
		        	'inputs': {
			            'select': {
							'id': 'payorContactInfoId',
							'options': tokenLookup.getBaseOptionsFilterObj()
							//,
							//'classIds': 'classActive'//????  //Make sure this writes over entire class attribute to rid the classDisabled.

			    		}
		        	}
		        };
				context.model.lens('requestComponent.requestInputForm.tokenDropdown').set(tokenFilter);

				// select default token
				for (var j = 0; j < tokenData.length; j++) {
					if (tokenData[j].default) {
						this.payorContactInfoId = tokenData[j].key + '@' + tokenData[j].value;
						break;
					}
				}

				// send message to view to populate token dropdown
	            this.output.emit('state', {
	                target: this,
	                value: 'populateTokens',
	                tokenData: tokenData
	            });
			}.bind(this));
		},

 		toggleTransactionAmountDecisionMaker: function(){
			// send message to view to enable/disable amount textbox
            this.output.emit('state', {
                target: this,
                value: 'enableDisableAmount',
                amountOption: {option: this.transactionAmountDecisionMaker}
            });
 		}
	};
});
