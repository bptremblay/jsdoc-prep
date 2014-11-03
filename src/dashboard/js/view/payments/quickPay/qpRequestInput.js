define(function(require){
	return function RequestInputView(){
		var self = this;
		var RequestInputBridge = self.createBridgePrototype(require('dashboard/view/webspec/payments/quickPay/qpRequestInput')),
			template = require('blue/template');

		this.template = require('dashboard/template/payments/quickPay/qpRequestInput');
		template.registerPartial('field', require('dashboard/template/payments/quickPay/common/field'));
		template.registerPartial('menu', require('dashboard/template/payments/quickPay/common/menu'));
		template.registerPartial('submenu', require('dashboard/template/payments/quickPay/common/submenu'));
		template.registerPartial('button', require('dashboard/template/payments/quickPay/common/button'));

        this.bridge = new RequestInputBridge({
            targets: {
            	send_money_link:'#qp_send_money_link',
                payor_id: '#payorId',
                payor_contact_info_id: '#payorContactInfoId',
                memo: '#memo',
                transaction_amount: '#transactionAmount',
                amount_option: '[name=transactionAmountDecisionMaker]',
                request_money_due_date: '#requestMoneyDueDate',
                next_button: '#next_button',
                cancel_button: '#cancel_button',
                select_recipient: '#payorId',
                change_amount_option: '[name=transactionAmountDecisionMaker]',
				payor_name: '',
				payor_contact_info: '',
				transaction_amount_decision_maker: '',
				transaction_number: '',
				transaction_expiry_date: ''
            }
        });

		this.init = function() {
			this.hideOverlay();

            self.bridge.on('state/populateTokens', function(data) {
                	self.populateTokens(data.tokenData);
            });

            self.bridge.on('state/enableDisableAmount', function(data) {
                	self.enableDisableAmount(data.amountOption);
            });

			this.populateTokens = function(tokenData){
		    	var optionsValues = '<select id="payorContactInfoId">';

		    	for (var i = 0; i < tokenData.length; i++) {
		    		optionsValues += '<option value="' + tokenData[i].key + '@' + tokenData[i].value + '"' + ((tokenData[i].default)? ' selected="selected"' : '') + '>' + tokenData[i].value + '</option>';
		    	}

		    	optionsValues += '</select>';
		    	var options = $('#payorContactInfoId');
		    	options.replaceWith(optionsValues);
			};

			this.enableDisableAmount = function(amountOption){
				var $amountTextbox = $('#transactionAmount');
	 			if (amountOption.option === '2'){
					$amountTextbox.attr('disabled','disabled');
	 			}
	 			else {
	 				$amountTextbox.removeAttr('disabled');
	 			}
			};
		};

        this.hideOverlay = function() {
            $('.modal-popup, .overlay, #pre-loader').fadeOut(300);
            $('#modal-content').empty();
        };
	};
});
