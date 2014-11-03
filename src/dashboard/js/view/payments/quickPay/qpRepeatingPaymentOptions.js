define(function(require){
	return function RepeatingPaymentOptionsView(){
		var self = this;
		var RepeatingPaymentOptionsBridge = this.createBridgePrototype(require('dashboard/view/webspec/payments/quickPay/qpRepeatingPaymentOptions'));
		var componentChannel = require('blue/event/channel/component');

		this.template = require('dashboard/template/payments/quickPay/qpRepeatingPaymentOptions');

        this.bridge = new RepeatingPaymentOptionsBridge({
            targets: {
            	frequency:'#transaction_frequency_option',
            	notify_on_single_option1: '#notify_on_single_option1',
            	notify_on_multi_option1: '#notify_on_multi_option1',
            	notify_on_multi_option2: '#notify_on_multi_option2',
            	first_notification_date: '#first_notification_date',
            	transaction_duration_option: '[name=transaction_duration]',
            	transaction_duration_occurrences: '#transaction_duration_occurrences',
            	repeating_payment_on_link:'#qp_repeat_payment_on',
            	repeating_payment_off_link:'#qp_repeat_payment_off',
            	frequency_change:'#transaction_frequency_option',
            	notify_on_single_option1_change: '#notify_on_single_option1',
            	notify_on_multi_option1_change: '#notify_on_multi_option1',
            	notify_on_multi_option2_change: '#notify_on_multi_option2',
            	first_notification_date_change: '#first_notification_date',
            	transaction_duration_option_change: '[name=transaction_duration]',
            	transaction_duration_occurrences_change: '#transaction_duration_occurrences',
            	transaction_notification_recurring_date_help_icon: '#first_notification_date_input_icon',
            	transaction_notification_recurring_date_help_close: '#transaction_notification_recurring_date_help_close',
            	transaction_notification_option_help_icon : '#notify_on_single_option1_input_icon',
            	transaction_notification_option_help_close: '#transaction_notification_option_help_close',
            	transaction_notification_multioption_help_icon: '#notify_on_multi_option1_input_icon',
            	transaction_notification_multioption_help_close:'#transaction_notification_multioption_help_close'
            }
        });

		this.init = function() {
            componentChannel.on('showHideNotifyOnDropdowns', function(data) {
                self.showHideNotifyOnDropdowns(data);
            });

            componentChannel.on('showHideSendOnInput', function(data) {
            	self.showHideSendOnInput(data.showHideOption);
            });

            componentChannel.on('enableDisableNumberOfPayments', function(data) {
            	self.enableDisableNumberOfPayments(data.transactionDuration);
            });

            componentChannel.on('populateFirstNotificationDates', function(data) {
            	self.populateFirstNotificationDates(data.dateOptions);
            });
            componentChannel.on('showTransactionNotificationRecurringDateHelpMessage', function() {
            	self.showTransactionNotificationRecurringDateHelp();
            });
            componentChannel.on('showTransactionNotificationOptionHelpMessage', function() {
            	self.showTransactionNotificationOptionHelp();
            });
			componentChannel.on('showTransactionNotificationMultiOptionHelpMessage', function() {
            	self.showTransactionNotificationMultiOptionHelp();
            });
            //Close
            componentChannel.on('hideTransactionNotificationRecurringDateHelpMessage', function() {
            	self.hideTransactionNotificationRecurringDateHelp();
            });
            componentChannel.on('hideTransactionNotificationOptionHelpMessage', function() {
            	self.hideTransactionNotificationOptionHelp();
            });
            componentChannel.on('hideTransactionNotificationMultiOptionHelpMessage', function() {
            	self.hideTransactionNotificationMultiOptionHelp();
            });

		};

		this.showHideNotifyOnDropdowns = function(notifyOnOptionsData){
			var $notifyOnSingleContainer = $('#notifyOnSingleContainer');
			var $notifyOnMultiContainer = $('#notifyOnMultiContainer');

			// update dropdowns, label and prompt
			if (notifyOnOptionsData.dropdownOption === 'multi'){
				$notifyOnSingleContainer.hide();
				$notifyOnMultiContainer.show();
	        	$('#notify_on_multi_option1').replaceWith(this.populateDropDown('notify_on_multi_option1', notifyOnOptionsData.notifyOnOption1));
	        	$('#notify_on_multi_option2').replaceWith(this.populateDropDown('notify_on_multi_option2', notifyOnOptionsData.notifyOnOption2));
	        	$('#notify_on_multi_option2_input .prompt').text(notifyOnOptionsData.prompt);
	        	$('#notify_on_multi_option2_input dl dt').text(notifyOnOptionsData.label);
			}
			else {
				$notifyOnMultiContainer.hide();
				$notifyOnSingleContainer.show();
	        	$('#notify_on_single_option1').replaceWith(this.populateDropDown('notify_on_single_option1', notifyOnOptionsData.notifyOnOption1));
	        	$('#notify_on_single_option1_input .prompt').text(notifyOnOptionsData.prompt);
			}
		};

		this.populateDropDown = function(id, dropDownOptions){
	    	var dropDown = '<select id="' + id + '">';

	    	for (var i = 0; i < dropDownOptions.length; i++) {
	    		dropDown += '<option value="' + dropDownOptions[i].value + '"' + ((dropDownOptions[i].selected)? ' selected="selected"' : '') + '>' + dropDownOptions[i].label + '</option>';
	    	}

	    	dropDown += '</select>';
	    	return dropDown;
		};

		this.showHideSendOnInput = function(showHideOption){
			var $sendOnContainer = $('#sendOnContainer');
 			if (showHideOption === 'show'){
				$sendOnContainer.show();
				$('#transactionAmount_input').parent().removeClass('col-lg-4').addClass('col-lg-2');
 			}
 			else {
 				$sendOnContainer.hide();
				$('#transactionAmount_input').parent().removeClass('col-lg-2').addClass('col-lg-4');
				$('#transaction_frequency_option').focus();
 			}
		};

		this.enableDisableNumberOfPayments = function(transactionDuration){
			var $numberOfPayments = $('#transaction_duration_occurrences');
 			if (transactionDuration === '1'){
				$numberOfPayments.attr('disabled','disabled');
 			}
 			else {
 				$numberOfPayments.removeAttr('disabled');
 			}
		};
		this.populateFirstNotificationDates = function(dateOptions){
        	$('#first_notification_date').replaceWith(this.populateDropDown('first_notification_date', dateOptions));
		};
		this.showTransactionNotificationRecurringDateHelp = function() {
        	$('#transaction_notification_recurring_date_help_message_content').show().css( {position:'absolute', top:'-65%', left: '35%'});
        	this.hideFlyout('#transaction_notification_recurring_date_help_message_content');
        };
        this.showTransactionNotificationOptionHelp = function() {
        	$('#transaction_notification_option_help_message_content').show().css( {position:'absolute', top:'-33%', left: '45%'});
        	this.hideFlyout('#transaction_notification_option_help_message_content');
        };
        this.showTransactionNotificationMultiOptionHelp = function() {
        	$('#transaction_notification_multioption_help_message_content').show().css( {position:'absolute', top:'-190%', left: '80%'});
        	this.hideFlyout('#transaction_notification_multioption_help_message_content');
        };
        this.hideTransactionNotificationRecurringDateHelp = function() {
        	$('#transaction_notification_recurring_date_help_message_content').hide();
        };
        this.hideTransactionNotificationOptionHelp = function() {
        	$('#transaction_notification_option_help_message_content').hide();
        };
        this.hideTransactionNotificationMultiOptionHelp=function() {
        	$('#transaction_notification_multioption_help_message_content').hide();
        };
        this.hideFlyout = function(containerId) {
        	$(containerId).parentsUntil('body').on('click',function () { // success message on any action of page
                $(containerId).hide();
                $('body').off('click');
            });
        };
	};
});
