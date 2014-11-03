define(function(require){
	return function TodoView(){
		var TodoBridge = this.createBridgePrototype(require('dashboard/view/webspec/payments/quickPay/qpTodoList'));
        var self = this;

		var template = require('blue/template');
		var controllerChannel = require('blue/event/channel/controller');

		template.registerPartial('table', require('dashboard/template/payments/quickPay/common/table'));
		template.registerPartial('field', require('dashboard/template/payments/quickPay/common/field'));
		template.registerPartial('button', require('dashboard/template/payments/quickPay/common/button'));
		template.registerPartial('declineOverlay', require('dashboard/template/payments/quickPay/qpDeclineOverlay'));

		this.template = require('dashboard/template/payments/quickPay/qpTodo');

        this.bridge = new TodoBridge({
            targets: {
                accept_money: '.Accept',
                request_money_transfer_pending_actions_activity:'.SendMoney',
                show:'#showDropdown',
                request_transaction_details:'.transactionDetails',
                see_more: '#see_more',
                close:'#close',
                decline_accept :'.decline_link_payment',
                decline_send:'.decline_link_request',
				transaction_notification_date: '',
				transaction_requestor: '',
				transaction_amount: '',
				transaction_type: '',
				memo: '',
				my_money_transfer_profile_info: '',
				transaction_modification_status: '',
				funding_account_display_name: ''
           }
        });

		this.init = function() {
            controllerChannel.on('showSuccess', function(obj) {
                self.renderSuccess(obj.value);
            }.bind(this));

            controllerChannel.on('showDeclineOverlay', function(obj) {
                self.renderDeclineOverlay(obj.value);
            }.bind(this));

            // self.hideOverlay();
		};

        this.hideOverlay = function() {
            this.$('.modal-popup, .overlay, #pre-loader').fadeOut(300);
            this.$('#modal-content').empty();
        };

        this.renderSuccess = function(obj) {
            var index = obj.row_index;
            var self = this;
            $('tr.defaultHide').hide();
            $('tr.row_' + index).hide();
            $('h2.mainTitle_' + index).html(obj.message[0]);
            $('span.subTitle_' + index).html(obj.message[1]);
            $('a.details_' + index).html(obj.message[2]);
            if (obj.message[0] != "") { $('tr.show_success_' + index).fadeIn(600); } //display cancel message when firt value is empty
            else {
                $('tr.show_cancel_' + index).fadeIn(600);
            }




            $('a.details_' + index).parentsUntil('body').on('click',function () { // success message on any action of page
                $('tr.show_success_' + index).hide();
                $('tr.show_cancel_' + index).hide();
                $('body').off('click');
            });

        };


        this.renderDeclineOverlay = function(obj) {
        	$('textarea').val('');
        	if(obj.declineType === 'payment'){
	        	$('#declined_button_request').show();
	       		$('#declined_button_payment').hide();
		        $('#declined_button_request').text(obj.declineBtn);

	       	}else{
	         	$('#declined_button_request').hide();
	       		$('#declined_button_payment').show();
		        $('#declined_button_payment').text(obj.declineBtn);

	       	}

			$('#confim_message').text(obj.confirmMessage);
			$('#decline_advisory').text(obj.declineAdvisory);
  			$('#toDodeclinedOverlay').fadeIn(300);
            $('tr.defaultHide').hide();
            $('#toDodeclinedOverlay').parentsUntil('body').on('click',function () {
                $('tr.show_decline_' + obj.row_index).hide();
                $('body').off('click');
            });
      	};
       this.renderDecline = function(obj) {
            $('tr.defaultHide').hide();
            $('tr.row_' + obj.row_index).hide();
            $('tr.memo').hide();
         	$('tr.show_decline_' + obj.row_index).show();
       };
	};
});
