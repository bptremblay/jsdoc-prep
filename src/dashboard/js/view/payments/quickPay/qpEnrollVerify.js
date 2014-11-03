define(function(require){
	return function EnrollVerifyView(){
		var template = require('blue/template');
		var EnrollVerifyBridge = this.createBridgePrototype(require('dashboard/view/webspec/payments/quickPay/qpEnrollVerify'));
		var componentChannel = require('blue/event/channel/component');
		var self = this;
		this.template = require('dashboard/template/payments/quickPay/qpEnrollVerify');
		template.registerPartial('field', require('dashboard/template/payments/quickPay/common/field'));
		template.registerPartial('menu', require('dashboard/template/payments/quickPay/common/menu'));
		template.registerPartial('submenu', require('dashboard/template/payments/quickPay/common/submenu'));
		template.registerPartial('button', require('dashboard/template/payments/quickPay/common/button'));
		template.registerPartial('enterContactInfo', require('dashboard/template/payments/quickPay/enterContactInfo'));
		template.registerPartial('progressbar', require('dashboard/template/payments/quickPay/common/progressbar'));
		template.registerHelper('base1', function(number) {
		return number + 1;
		});


    var controllerChannel = require('blue/event/channel/controller');


        this.bridge = new EnrollVerifyBridge({
            targets: {
                next_button: '#next_button',
                close_button: '#close_button',
                text_verify: '.text',
                resend_code: '.resendLink'

            }
        });

		this.init = function() {
			var contactId = '';
			$('#next_button').prop('disabled',true) // on initial page load button should be de activated
			self.bridge.on('verifyValue', function(data) {
                contactId = self.getElementData(data.value);
                controllerChannel.emit('triggerVerifyService', {
                	target: this,
            		contactId: contactId,
            		verificationCode:data.value
        		});
            });

			componentChannel.on('showHideVerify', function(data) {
                self.displayVerify(data);
            });
		};

		// get id associated to the value entered
		this.getElementData = function(fieldValue){
		//	var $el = $('input[value="' + fieldValue + '"]');  framework isn't picking up this jquery identifier
			var $this = '', id = '';

			$('#qpEnrollVerify').find('input').each(function( index ) {
				$el = $(this);
				if ($el.val() === fieldValue){
					id = $el.prop('id');
					return false;
				};
			});
			return id;
		}

		// create view of valid states
		this.displayVerify = function(data){
			var showHideVerify = data.option;
			var id = data.contactId;
			var $elCheck = $('#verifyThis' + id);
			var $elInput = $('#verifyThis' + id).parent().find('input');
			var $elInputs = $('#qpEnrollVerify').find('input');
			var $elLinks = $elInput.parent().parent().parent().parent().find('.links');
			var $elNext =  $('#next_button');

 			if (showHideVerify === 'show'){
				$elCheck.show();
				$elLinks.hide();
				$elInput.prop('disabled', true );

				if ($($elInputs[0]).prop('id') == id) {
					$elNext.prop( 'disabled', false );
				}

 			}
 			else {
 				$elCheck.hide();
 				$elLinks.show();
 			}
		};

        this.hideOverlay = function() {
            $('.modal-popup, .overlay, #pre-loader').fadeOut(300);
            $('#modal-content').empty();
        };
	};
});
