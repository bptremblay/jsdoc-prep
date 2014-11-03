define(function(require) {

	return function PaymentsMenuView() {
		var settings = require('dashboard/settings'),
			componentChannel = require('blue/event/channel/component'),
			self = this;

		this.template = require('dashboard/template/payments/paymentsMenu/paymentsMenu');


		this.init = function() {

			this.bridge = this.createBridge(require('dashboard/view/webspec/payments/paymentsMenu/paymentsMenu'));

			/*this.bridge = new bridge({
            	targets: {
	                requestPaymentActivity: '#requestPaymentActivity',
	                payBills: '#payBills',
	                sendMoney: '#sendMoney',
	                addFundingAccounts: '#addFundingAccounts',
	                manageFundingAccounts: '#manageFundingAccounts',
	                paymentMenuAdditionalOptions: '#paymentMenuAdditionalOptions'
        		}
        	});
*/



			this.bridge.on('state/toggleAdditionalMenu', function(data) {


				if (data.event.domEvent.type == 'mouseleave')
				{
					if (!$('.submenu').hasClass('hide'))
					{
						$('.submenu').addClass('hide');
					}
				}
				else
				{
					if ($('.submenu').hasClass('hide'))
					{
						$('.submenu').removeClass('hide');
					}
					else
					{
						$('.submenu').addClass('hide');
					}
				}

			});
			this.preLoader();
			this.changeStyle();


		};

        this.preLoader = function() {
            $(document).ajaxStop(function() {
                $('.overlay, #pre-loader').hide();
                // $(document).scrollTop(0);
            });
        };

		this.changeStyle = function() {
			$('#style1').attr('href', settings.smartAdminStyle1);
			$('#style2').attr('href', settings.smartAdminStyle2);
			$('body').css('height', '100%');
		};

		this.onDataChange = function onDataChange() {
			this.rerender();
		};
	};
});
