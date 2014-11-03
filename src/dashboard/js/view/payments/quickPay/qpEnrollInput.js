define(function(require){
	return function EnrollInputView(){
		var self = this;
		this.template = require('dashboard/template/payments/quickPay/qpEnrollInput');
		this.bridge = this.createBridge(require('dashboard/view/webspec/payments/quickPay/qpEnrollInput'));

		this.init = function() {
			this.hideOverlay();

            self.bridge.on('state/showHideSetupAnotherEmail', function(data) {
                self.showHideSetupAnotherEmail(data.showHideOption);
            });

            self.bridge.on('state/enableDisableNextButton', function(data) {
                self.enableDisableNextButton(data.enableDisableOption);
            });

            self.bridge.on('state/showHideTcpaDisclosure', function(data) {
            	self.showHideTcpaDisclosure(data.showHideOption);
            });
		};

		this.showHideSetupAnotherEmail = function(showHideOption){
			var $setupAnotherEmailContainer = $('#setupAnotherEmailContainer');
 			if (showHideOption.option === 'show'){
				$setupAnotherEmailContainer.show();
 			}
 			else {
 				$setupAnotherEmailContainer.hide();
 			}
		};

		this.enableDisableNextButton = function(enableDisableOption){
			var $nextButton = $('#next_button');
 			if (enableDisableOption.option === 'enable'){
				$nextButton.prop('disabled', false);
 			}
 			else {
				$nextButton.prop('disabled', true);
 			}
		};

		this.showHideTcpaDisclosure = function(showHideOption){
			var $tcpaDisclouserContainer = $('#tcpaDisclouserContainer');
 			if (showHideOption.option === 'show'){
				$tcpaDisclouserContainer.show();
 			}
 			else {
 				$tcpaDisclouserContainer.hide();
 			}
		};

        this.hideOverlay = function() {
            $('.modal-popup, .overlay, #pre-loader').fadeOut(300);
            $('#modal-content').empty();
        };
	};
});
