define(function(require){
	//Don't need this include because better-dateinput-polyfill was converted to a require module,
	//that depends/requires better-dom, and calls at top this same line require('dashboard/vendor/shim/better-dom');
	//var DOM = require('dashboard/vendor/shim/better-dom');
	return function SendView(){
		var self = this;
		var SendBridge = this.createBridgePrototype(require('dashboard/view/webspec/payments/quickPay/qpSendInput')),
			template = require('blue/template');
		var componentChannel = require('blue/event/channel/component');

		this.template = require('dashboard/template/payments/quickPay/qpSendInput');
		template.registerPartial('field', require('dashboard/template/payments/quickPay/common/field'));
		template.registerPartial('menu', require('dashboard/template/payments/quickPay/common/menu'));
		template.registerPartial('submenu', require('dashboard/template/payments/quickPay/common/submenu'));
		template.registerPartial('button', require('dashboard/template/payments/quickPay/common/button'));
		template.registerPartial('progressbar', require('dashboard/template/payments/quickPay/common/progressbar'));
		template.registerHelper('base1', function(number) {
		return number + 1;
		});

        this.bridge = new SendBridge({
            targets: {
            	request_money_link:'#qp_request_money_link',
                payee_id: '#payeeId',
                payee_contact_info_id: '#payeeContactInfoId',
                funding_account_id: '#fundingAccountId',
                transaction_amount: '#transactionAmount',
                transaction_notification_date: '#transactionNotificationDate',
                memo: '#memo',
                is_repeating: '#is_repeating',
                send_next_button: '#send_next_button',
                send_cancel_button: '#send_cancel_button',
                select_recipient: '#payeeId',
                amount_change: '#transactionAmount',

                //Fields added to match the component spec/webspec constraint
			    payee_name: '',
			    payee_contact_info: '',
			    funding_account_display_name: '',
			    account_balance: '',
			    transaction_number: '',
			    transaction_expiry_date: '',
			    transaction_recurring: '',
			    transaction_frequency_option: '',
			    transaction_notification_option_1: '',
			    transaction_notification_option_2: '',
			    transaction_duration: '',
			    transaction_duration_occurences: '',
			    transaction_notifications: '',
                //info icons
                quickpay_news_help_link : '#quickpay_news_help_message_link',
                money_transfer_contact_help_icon: '#payeeContactInfoId_input_icon',
                transaction_notification_date_help_icon: '#transactionNotificationDate_input_icon',

                //CLose icons
                quickpay_news_help_close : '#quickpay_news_help_close',
                money_transfer_contact_help_close : '#money_transfer_contact_help_close',
                transaction_notification_date_help_close: '#transaction_notification_date_help_close'

            }
        });

		this.init = function() {
			var dateinput = require('dashboard/vendor/shim/better-dateinput-polyfill');
			this.hideOverlay();

            componentChannel.on('populateTokens', function(data) {
                self.populateTokens(data.tokenData);
            });

            componentChannel.on('showNewWithChase', function() {
            	self.showNewHelp();
            });

			componentChannel.on('showMoneyTransferContactHelpMessage', function() {
            	self.showMoneyTransferContactHelp();
            });
			componentChannel.on('showTransactionNotificationDateHelpMessage', function() {
            	self.showTransactionNotificationDateHelp();
            });


			//Close icon
			componentChannel.on('hideNewWithChaseHelp', function() {
            	self.hideNewHelp();
            });
            componentChannel.on('hideMoneyTransferContactHelpMessage', function() {
            	self.hideMoneyTransferContactHelp();
            });
            componentChannel.on('hideTransactionNotificationDateHelpMessage', function() {
            	self.hideTransactionNotificationDateHelp();
            });
			//

			componentChannel.on('closeMessageFlyout', function(data) {
            	self.closeFlyout(data);
            });

			//closeFlyoutMessage
			this.populateTokens = function(tokenData){
		    	var optionsValues = '<select id="payeeContactInfoId">';

		    	for (var i = 0; i < tokenData.length; i++) {
		    		optionsValues += '<option value="' + tokenData[i].key + '@' + tokenData[i].value + '"' + ((tokenData[i].default)? ' selected="selected"' : '') + '>' + tokenData[i].value + '</option>';
		    	}

		    	optionsValues += '</select>';
		    	var options = $('#payeeContactInfoId');
		    	options.replaceWith(optionsValues);
			};
		};

        this.hideOverlay = function() {
            $('.modal-popup, .overlay, #pre-loader').fadeOut(300);
            $('#modal-content').empty();
        };
        this.showNewHelp = function() {

			$('#quickpay_news_help_message_content').show();
			$('#quickpay_news_help_message_content' ).css( {position:'absolute', top: '27px', left: '152px'});


			this.hideFlyout('#quickpay_news_help_message_content');

			// $('#quickpay_news_help_message_content').parentsUntil('body').on('click',function () { // success message on any action of page
   //              $('#quickpay_news_help_message_content').hide();
   //              $('body').off('click');
   //          });
        };
        this.showMoneyTransferContactHelp = function() {

			$('#money_transfer_contact_info_help_message_content').show();
			$('#money_transfer_contact_info_help_message_content').css( {position:'absolute', top:'-30px', left: '170px'});

			this.hideFlyout('#money_transfer_contact_info_help_message_content');

			// $('#money_transfer_contact_info_help_message_content').parentsUntil('body').on('click',function () { // success message on any action of page
   //              $('#money_transfer_contact_info_help_message_content').hide();
   //              $('body').off('click');
   //          });
        };
        this.showTransactionNotificationDateHelp = function() {
        	$('#transaction_notification_date_help_message_content').show();
        	$('#transaction_notification_date_help_message_content').css( {position:'absolute', top:'-2.3em', left:'6em'});

			this.hideFlyout('#transaction_notification_date_help_message_content');


        	// $('#transaction_notification_date_help_message_content').parentsUntil('body').on('click',function () { // success message on any action of page
         //        $('#transaction_notification_date_help_message_content').hide();
         //        $('body').off('click');
         //    });
        };

        //close icon
        this.hideNewHelp = function() {
			$('#quickpay_news_help_message_content').hide();
        };
        this.hideMoneyTransferContactHelp = function() {
			$('#money_transfer_contact_info_help_message_content').hide();
		};
        this.hideTransactionNotificationDateHelp = function() {
        	$('#transaction_notification_date_help_message_content').hide();
        };


        this.hideFlyout = function(containerId) {
        $(containerId).parentsUntil('body').on('click',function () { // success message on any action of page
                $(containerId).hide();
                $('body').off('click');
            });
        };

	};
});
