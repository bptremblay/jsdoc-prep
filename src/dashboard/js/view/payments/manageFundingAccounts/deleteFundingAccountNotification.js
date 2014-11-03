define(function(require) {

	var bridge = require('blue/bridge').create(
					require('dashboard/view/webspec/payments/manageFundingAccounts/deleteFundingAccountNotification'),{});

	var componentChannel = require('blue/event/channel/component');

	return function deleteFundingAccountNotificationView() {
		var self = this;
		this.template = require('dashboard/template/payments/manageFundingAccounts/deleteFundingAccountNotification');

		this.bridge = new bridge({
			targets: {
				close_delete_funding_account_notification: '#close_delete_funding_account_notification'
			}
		});


		this.init = function(){
            self.bridge.on('state/showDeleteFundingAccountNotification', function(data) {
            	console.log("!!!---state/showDeleteFundingAccountConfirmation");
				$('#delete_funding_account_notification_modal').removeClass('hide-xs');
            });

            self.bridge.on('state/hideDeleteFundingAccountNotification', function(data) {
            	console.log("!!!---state/hideDeleteFundingAccountConfirmation");
				$('#delete_funding_account_notification_modal').addClass('hide-xs');
            });


		};

	};
});
