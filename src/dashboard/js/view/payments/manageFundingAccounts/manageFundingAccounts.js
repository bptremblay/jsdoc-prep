define(function(require) {

	var bridge = require('blue/bridge').create(
					require('dashboard/view/webspec/payments/manageFundingAccounts/update_funding_accounts'),
					{}
				 ),

	template = require('blue/template');

	template.registerPartial('field', require('dashboard/template/payments/manageFundingAccounts/common/field'));
	template.registerPartial('button', require('dashboard/template/payments/manageFundingAccounts/common/button'));

	var componentChannel = require('blue/event/channel/component');

	return function view() {
		self = this;
		this.template = require('dashboard/template/payments/manageFundingAccounts/manageFundingAccounts');

		this.bridge = new bridge({
			targets: {
				updatePrimaryDesignation: '.fa-info-circle',
				updateFundingAccount: '.edit_funding_account',
				deleteFundingAccount: '.delete_funding_account',
				cancelUpdateFundingAccount: '.jpui.button.cancel-update',
				saveUpdateFundingAccount: '.jpui.button.save-update',
				closePrimaryDesignationAdvisory: '#primary_advisory .fa-times',
				fundingAccounts: '#funding_accounts',
				requestPrimaryHelpMessage: '#selector'
			}
		});


		this.init = function(){
			var self = this;
           self.bridge.on('state/showDeleteFundingAccountConfirmation', function(data) {
				$('#confirmation-modal').removeClass('hide-xs');
            });

            self.bridge.on('state/showDeleteFundingAccountMessage', function(data) {
            	$('#delete_funding_account_message').removeClass('hide');
            });

            self.bridge.on('state/updatePrimaryDesignation', function(data) {
				self.updatePrimaryDesignation();
            });

            self.bridge.on('state/closePrimaryDesignationAdvisory', function() {
            	self.closePrimaryDesignationAdvisory();
            });

            self.bridge.on('state/showEditFundingAccount', function(data) {
            	var editFundingAccountDivId = '#edit_funding_account_' + data.ePayAccountRefId;
            	var editLinkId = '#edit' + data.ePayAccountRefId;
            	var nicknameInputId = '#nickname_input_' + data.ePayAccountRefId;

				console.log("View: state/showEditFundingAccount");

				$(nicknameInputId).val(data.nickname);
				$(editLinkId).toggle();
            	$(editFundingAccountDivId).toggle();
			});

			self.bridge.on('state/cancelUpdateFundingAccount', function(data) {
            	var editFundingAccountDivId = '#edit_funding_account_' + data.ePayAccountRefId;
            	var editLinkId = '#edit' + data.ePayAccountRefId;

				console.log("View: state/cancelUpdateFundingAccount");

				$(editLinkId).toggle();
            	$(editFundingAccountDivId).toggle();
			});

			self.bridge.on('state/saveUpdateFundingAccount', function(data) {
            	var editFundingAccountDivId = '#edit_funding_account_' + data.ePayAccountRefId;
            	var editLinkId = '#edit' + data.ePayAccountRefId;

				console.log("View: state/saveUpdateFundingAccount");

				$(editLinkId).toggle();
            	$(editFundingAccountDivId).toggle();
			});


		};

		this.updatePrimaryDesignation = function() {
			var primaryDesignationIcon = this.$element.find('.fa-info-circle'),
			advisoryTooltip = this.$element.find('#primary_advisory'),
			position = primaryDesignationIcon.position();


			var top = (position.top + (advisoryTooltip.offsetHeight-50));

			advisoryTooltip.css({top:top}).removeClass('hide');
		};

		this.closePrimaryDesignationAdvisory = function() {
			$('#primary_advisory .fa-times').parent().addClass('hide');
		};


	};
});
