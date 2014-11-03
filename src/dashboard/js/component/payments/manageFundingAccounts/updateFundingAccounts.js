define(function(require) {
	var context = null,
		controllerChannel = require('blue/event/channel/controller');

	return {

		init: function() {

			context = this.settings.context;
		},

		getFundingAccounts: function( payeeId ) {
			context = this.settings.context;
			var self = this;

			context.cardFundingServices.cardFundingServices['card.funding.list']({payeeId: payeeId}).then(function(data) {
				if (data.code == 'SUCCESS')
				{
					self.tData = context.cardPaymentListDataTransform.getTransformedPayeeData(data.payees,data.fundingAccounts,payeeId);
					self.pData = context.cardPaymentListDataTransform.getTransformedAccountsData(data.fundingAccounts,self.settings.spec.name, data.payees[0].payeeId);

					if (data.payees != undefined && payeeId == 0)
					{
						payeeId = data.payees[0].payeeId;
					}

		            controllerChannel.emit('trigger', {
		                target: this,
		                value: 'showFundingAccounts',
		                headerData: self.tData,
		                fundingData: self.pData,
		                payeeId: payeeId
		            });
				}

			}.bind(this));

		},

		updatePrimaryFundingAccountDesignation: function() {
			this.output.emit('state', {
	            value: 'updatePrimaryDesignation'
	        });
		},
		requestPrimaryHelpMessage: function() {

		},

		updateFundingAccount: function(param) {

			console.log('Component: Edit (updateFundingAccount): ' + param);

			requestParameters = {
					'ePayAccountRefId': param,
					'payeeId': this.model.lens('currentPayeeId').get()
			};

			//cardFundingUpdateListServices
			context.cardFundingServices.cardFundingServices['card.funding.update.list'](requestParameters).then(function(responseBody) {

				if (responseBody.code = 'SUCCESS')
				{
		            controllerChannel.emit('trigger', {
		                target: this,
		                value: 'editFundingAccount',
		                nickname: responseBody.nickname,
		                nicknameUpdateAllowed: responseBody.accountUpdateAllowed
		            });

		            // Make a call to the View
					this.output.emit('state', {
		                target: this,
		                value: 'showEditFundingAccount',
		                ePayAccountRefId: param, // need to refactor with Ractive later...
		                nickname: responseBody.nickname
				    });
				}
			}.bind(this));



		},


		deleteFundingAccount: function(ePayAccountRefId) {
			var payeeId = this.model.lens('currentPayeeId').get();
			requestParameters = {
					'ePayAccountRefId': ePayAccountRefId,
					'payeeId': payeeId
			};

			context.cardFundingServices.cardFundingServices['billpay.card.funding.delete.options.list']( requestParameters )
				.then(function(responseBody) {
		            controllerChannel.emit('trigger', {
		                target: this,
		                value: 'showDeleteFundingAccountConfirmation',
		                status: responseBody.statusCode,
		                maskedAccount: responseBody.ePayAccountMask,
		                bankName: responseBody.ePayAccountBankName,
		                ePayAccountRefId: ePayAccountRefId,
		                payeeId: payeeId,
		                payeeLabel: responseBody.payeeLabel
		            });
				});

		},

		cancelUpdateFundingAccount: function(param) {

			console.log('Component: Cancel (cancelUpdateFundingAccount): ' + param);

			// Make a call to the View
			this.output.emit('state', {
                target: this,
                value: 'cancelUpdateFundingAccount',
                ePayAccountRefId: param // need to refactor...
		    });
		},

		saveUpdateFundingAccount: function(param) {

			console.log('Component: Save (saveUpdateFundingAccount): ' + param);

			// Get parameters
			var payeeId = param.split('|')[0],
				ePayAccountRefId = param.split('|')[1],
				nicknameValue = $('#nickname_input_' + ePayAccountRefId).val();  // jquery hack for now...  (refactored after Ractive)

			// Parse out the parameter
			requestParameters = {
					'payeeId': payeeId,
					'ePayAccountRefId': ePayAccountRefId,
					'nickname': nicknameValue
			};

			//cardFundingUpdateServices
			context.cardFundingServices.cardFundingServices['card.funding.update'](requestParameters).then(function(responseBody) {

				if (responseBody.code = 'SUCCESS')
				{
		            console.log(responseBody);

		            // Refresh the 'Funding Accounts' list
		            this.getFundingAccounts(this.model.lens('currentPayeeId').get());

		          	// Display confirmation message
		            controllerChannel.emit('trigger', {
						message: responseBody.nickname,
						action: 'UPDATE',
			            value: 'showFundingAccountMessage'
		        	});

		            // Make a call to the View (collapse the 'update' pane)
					this.output.emit('state', {
		                target: this,
		                value: 'saveUpdateFundingAccount',
		                ePayAccountRefId: ePayAccountRefId
				    });

				}
			}.bind(this));

		},

		exitDeleteFundingAccount: function() {

		},

		exitPrimaryHelpMessage: function() {
			this.output.emit('state', {
                target: this,
                value: 'closePrimaryDesignationAdvisory'
		    });


		},

		confirmFundingAccountDeletion: function(data) {
			debugger;
    		this.getFundingAccounts(this.model.lens('currentPayeeId').get());
	        controllerChannel.emit('trigger', {
	        	message: data.nickname,
				action: 'DELETE',
	            value: 'showFundingAccountMessage'
        	});
		},

		cancelFundingAccountDeletion: function() {

		}

	};

});
