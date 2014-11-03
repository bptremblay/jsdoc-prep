define(function(require) {

	return function PaymentsMenuView() {
		var settings = require('dashboard/settings'),
			componentChannel = require('blue/event/channel/component'),
			PaymentMenuBridge = require('blue/bridge').create(require('dashboard/view/webspec/payments/paymentsMenu/paymentmenu'), {});

			self = this;
		//TODO: Remove emit support settings as soon as possible
		self.instanceName = 'pntmenuview';
		self.name = 'view';


    	var self = this;

        this.bridge = new PaymentMenuBridge({
            targets: {
            	requestPaymentActivity: '#requestPaymentActivity',
            	sendMoney: '#sendMoney',
            	navigation: '#payment-bar',
            	manageFundingAccounts: '#manageFundingAccounts'
            }
        });

		this.template = require('dashboard/template/header/paymentsMenu');

		this.init = function() {

			this.preLoader();
			this.changeStyle();


			var self = this;
			this.eventManager = {
				click: {
                    '.submenu-parent': function()
					{
						$('.submenu').removeClass('hide');
					}
				},
				mouseleave: {
					'.submenu-parent-container': function()
					{
						$('.submenu').addClass('hide');
					}
				}
			};

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
