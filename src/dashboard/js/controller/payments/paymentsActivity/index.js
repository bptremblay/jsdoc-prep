define(function(require) {

	return function IndexController() {

		var observable = require('blue/observable'),
			controllerChannel = require('blue/event/channel/controller'),
			componentChannel = require('blue/event/channel/component'),
			//Payment Activity Header
			//paymentsActivityHeaderSpec = require('dashboard/spec/payments/paymentsActivity/paymentsActivityHeader'),
			paymentsActivityHeaderSpec = require('bluespec/payment_activity_header'),
			paymentsActivityHeaderMethods = require('dashboard/component/payments/paymentsActivity/paymentsActivityHeader'),
			//Payments Activity Component
			paymentsActivitySpec = require('dashboard/spec/payments/paymentsActivity/paymentsActivity'),
			//paymentsActivitySpec = require('bluespec/payment_activity'),
			paymentsActivityMethods = require('dashboard/component/payments/paymentsActivity/paymentsActivity'),
			//Payments Acitvity Menu Component
			//paymentsActivityMenuSpec = require('dashboard/spec/payments/paymentsActivity/paymentsActivityMenu'),
			paymentsActivityMenuSpec = require('bluespec/payment_activity_menu'),
			paymentsActivityMenuMethods = require('dashboard/component/payments/paymentsActivity/paymentsActivityMenu');

		this.init = function() {
			//this.paymentsActivityMenuServices.().then(function(data) {
			//	console.log("HERE");
			//});
			var context = this;
            this.model = observable.Model.combine({
                'paymentsActivityHeaderComponent': {
                	automaticPaymentEnrollmentStatus: true
                },
                'paymentsActivityComponent': {

                }
            });



             controllerChannel.on({
                'trigger/requestCreditCardPaymentActivity': function() {
		            this.register.components(this, [{
		                name: 'paymentsActivityHeader',
		                model: this.model.lens('paymentsActivityHeaderComponent'),
		                spec: paymentsActivityHeaderSpec,
		                methods: paymentsActivityHeaderMethods
		            }, {
		                name: 'paymentsActivity',
		                model: this.model.lens('paymentsActivityComponent'),
		                spec: paymentsActivitySpec,
		                methods: paymentsActivityMethods
		            }]);

                    this.executeCAV([[this.components.paymentsActivityHeader, 'payments/paymentsActivity/paymentsActivityHeader', {
                        append: true,
                        'target': '#payments_activity_header'
                    }]]);
                }.bind(this),
                'trigger/displayPaymentsActivity' : function(data) {
                	this.handleDisplayPaymentsActivity(data.transformedData);
                }.bind(this),
                'trigger/cancelScheduledPayment' : function(data) {
					//console.log('index controller -> cancelScheduledPayment method');
                }.bind(this)
             });
		};


		this.handleDisplayPaymentsActivity = function(transformedData) {

			var observedModel = this.model.lens('paymentsActivityComponent');
			observedModel.lens('transactions').set(transformedData.transactions);
			observedModel.lens('account_display_name').set(transformedData.account_display_name);
			var theAccounts = [],
				inactiveAccounts = [];

		    observedModel.lens('inactiveAccounts').set(false);

			for (index = 0; index < transformedData.account_display_name.length; ++index) {
    			if(transformedData.account_display_name[index].deleteFlag == false) {
    				theAccounts.push(transformedData.account_display_name[index]);
    			}else{
    				inactiveAccounts.push(transformedData.account_display_name[index]);
    			}
			};

			console.log(inactiveAccounts);
			console.log(theAccounts);

			if (inactiveAccounts.length > 0){
				observedModel.lens('inactiveAccounts').set(true);
				theAccounts.push({label:'-----Inactive Account(s)-----'});
				for (i = 0; i < inactiveAccounts.length; i++){
					theAccounts.push(inactiveAccounts[i]);
				}

				observedModel.lens('account_display_name').set(theAccounts);
				observedModel.lens('theAccounts').set(theAccounts);

			}


			observedModel.lens('notList').set(true);
			if( observedModel.lens('account_display_name').get().length > 1 ){
				observedModel.lens('notList').set(false);
			}


			this.executeCAV([[this.components.paymentsActivity, 'payments/paymentsActivity/paymentsActivity', {
            	append: false,
            	'target': '#payments_activity'
            }]]);
		};


		/**
		 * Function for default action
		 * @function index
		 * @memberOf module:Indexthis
		 */

		this.index = function(params) {
           // Add the white bar on top of the payment activity menu item when
			componentChannel.emit('state', {
               target: this,
               value: 'paymentMenuOptionSelected',
               menuId: 'paymentsActivity'
            });

			//Create component for the Payment Activity Menu on the Left
			this.register.components(this, [{
                name: 'paymentsActivityMenu',
                model: this.model.lens('paymentsActivityMenuComponent'),
                spec: paymentsActivityMenuSpec,
                methods: paymentsActivityMenuMethods
            }]);

            this.executeCAV([this.components.paymentsActivityMenu, 'payments/paymentsActivity/paymentsActivityMenu', {
                append: false,
                'target': '#content'
            }]);
		};
	};
});
