define(function(require) {
	var context = null,
		controllerChannel = require('blue/event/channel/controller'),
		dynamicContentUtil = require('common/utility/dynamicContentUtil');

	return {
		init: function() {
			context = this.settings.context;
		},

		deleteFundingAccount: function() {
			scope = this;
			requestParameters = {
					'ePayAccountRefId': this.model.lens('ePayAccountRefId').get(),
					'payeeId': this.model.lens('payeeId').get()
			};
			context.cardFundingServices.cardFundingServices['billpay.card.funding.delete'](requestParameters).then(function(responseBody) {
				if (responseBody.code == "SUCCESS") {
					//hide modal
           			scope.output.emit('state', {
                		target: this,
                		value: 'hideDeleteFundingAccountConfirmation'
            		});

		            controllerChannel.emit('trigger', {
		                target: this,
		                value: 'confirmFundingAccountDeletion',
		                nickname: responseBody.bankName + " (" + responseBody.mask + ")"
		            });
          		}
			});

		},

		doNotDeleteFundingAccount: function() {
            this.output.emit('state', {
                target: this,
                value: 'hideDeleteFundingAccountConfirmation'
            });
		},

		showDeleteFundingAccountConfirmation: function(data) {
			//Fill in the label placeholders with the data received from the service
			dynamicContentUtil.dynamicContent.set(this, 'delete_funding_account_confirmation_message', {
			     NICKNAME: data.bankName + " " + data.maskedAccount,
			     CARD: data.payeeLabel
			})

			//set the value of the button
			this.model.lens('ePayAccountRefId').set(data.ePayAccountRefId);
			this.model.lens('payeeId').set(data.payeeId);
			//show modal
            this.output.emit('state', {
                target: this,
                value: 'showDeleteFundingAccountConfirmation'
            });
		}

	};

});
