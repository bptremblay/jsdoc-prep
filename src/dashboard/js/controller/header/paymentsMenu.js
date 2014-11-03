/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module Indexthis
 **/
define(function(require) {

	return function PaymentsMenuController() {

		var observable = require('blue/observable'),
			componentChannel = require('blue/event/channel/component'),
			controllerChannel = require('blue/event/channel/controller'),

			//PaymentMenuSpec = require('dashboard/spec/payments/paymentsMenu/paymentsMenu'),
			PaymentMenuSpec = require('bluespec/payment_menu'),
			PaymentMenuMethods = require('dashboard/component/payments/paymentsMenu/paymentsMenu'),
			$this = this;

		this.init = function() {
			var paymentMenuModel = observable.Model({
					status: true,
					paymentMenuOptions: null,
					showBlock: true
				});

			this.model = observable.Model.combine({
				'paymentMenuComponent': paymentMenuModel
			});

			//Create named instances that are available @controller.components.{componentName}
			this.register.components(this, [{
				name: 'paymentMenuComponent',
				model: paymentMenuModel,
				spec: PaymentMenuSpec,
				methods: PaymentMenuMethods
			}]);

			var self=this;

			controllerChannel.on({
				'activePaymentMenuTab': function(data) {
					if (data.menuId) {
						this.components.paymentMenuComponent.activePaymentMenuTab(data);
					}

				}.bind(this),
				'inactivePaymentMenuTab': function() {
					this.components.paymentMenuComponent.inactivePaymentMenuTab();
				}.bind(this),
				'initHeader': function(params) {
					this.index(params);
				}.bind(this),
				'trigger/showPaymentMenu': function() {
					self.showMenu();
				}
			});

			controllerChannel.on({
				'setProfileHeader': function(data) {
					this.model.lens('paymentMenuComponent.showBlock').set(false);
					this.model.lens('moduleHeaderComponent.headerLabel').set(data.headerLabel);
				}.bind(this)
			});

		};

		this.showMenu = function() {

			this.executeCAV([[this.components.paymentMenuComponent, 'payments/paymentsMenu/paymentsMenu', {
            	append: false,
            	'target': '#pnt-tabs',
            	react: true
            }]]);
		};

		/**
		 * Function for default action
		 * @function index
		 * @memberOf module:Indexthis
		 */
		this.index = function() {

			this.model.lens('paymentMenuComponent').set(this.settings.get('paymentMenuInstance'));
			this.components.paymentMenuComponent.buildMenu();

		};

        //Use this action method to hide the payments menu
        this.ignore = function() {

            this.model.lens('paymentMenuComponent.showBlock').set(false);

			this.executeCAV([[this.components.paymentMenuComponent, 'payments/paymentsMenu/paymentsMenu', {
            	append: false,
            	'target': '#pnt-tabs',
            	react: true
            }]]);

            //return ['payments/paymentsMenu/paymentsMenu', this.model];
        };
	};
});
