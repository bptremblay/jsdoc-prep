/**
 * @fileoverview Defines QuickPay Todo activities controller.
 * @author Diane Palla
 */
define(function(require){

		var todoSpec = require('bluespec/quickpay_pending_actions_activity_temp'),
			todoMethods = require('dashboard/component/payments/quickPay/qpTodoList');

		var declineSpec = require('bluespec/decline_quickpay_payment'),
			declineMethods = require('dashboard/component/payments/quickPay/qpDeclineOverlay');

		return function SendController() {
	    var controllerChannel = require('blue/event/channel/controller'),
	    	observable = require('blue/observable');

		/**
		 * Constructor - Creates empty models and setup listeners for the notifications
		 */
	    this.init = function(){
	    	this.controllerChannel = controllerChannel;

            var todoModel = observable.Model({});
			var declineModel = observable.Model({});

    		this.model = observable.Model.combine({
                'todoComponent': todoModel,
                'declineComponent': declineModel
            });
			//create a blank component to render the QuickPay Layout
		    this.register.components(this, [{
		        name: 'qpLayoutComponent',
		        model: {},
		        spec: {'name': 'blankSpec'},
		        methods: {}
		    }]);

			this.controllerChannel = controllerChannel;

            // listen for notifications
            controllerChannel.on({
                'showTodoList': function() {
                	this.entry();
                }.bind(this)
            });
            controllerChannel.on({
                'showRcvConfirm': function() {
              //  	this.accept();
                }.bind(this)
            });
            controllerChannel.on({
                'renderToDoList': function() {
                	this.renderToDoList();
                }.bind(this)
            });
            controllerChannel.on({
                'indexTodo': function(data) {
                	this.index(data);
                }.bind(this)
            });

	    };

	    var getNum = function(transactionIdData) {
	    	//gaurantees num type
	    	var transactionId = parseInt(transactionIdData);
			if(isNaN(transactionId)) {
				transactionId = null;
			}

			return transactionId;
	    };
		/**
		 *  Landing page, Show list of todo Items
		 */
		this.index = function(data) {
			var data = data&&data.data ?  data.data : null;

			var transactionId = null;
			var transActionRequestType = 1; //Default to Send

			if(data&&data.length>0)
			{
				var transactionIdData = data[0];
				transactionId = getNum(transactionIdData);

				var transActionRequestTypeData = null;


				if(data.length>1) {
					transActionRequestTypeData = data[1];
					transActionRequestType = getNum(transActionRequestTypeData);
				}
			}

			if(transactionId!==null) {
				//Send Money
				if(transActionRequestType === 1) {
					var requestMoneyData = { paymentId: transactionId };
					this.register.components(this, [{
		                name: 'todoComponent',
		                model: this.model.lens('todoComponent'),
		                spec: todoSpec,
		                methods: todoMethods
		            }]);
		            this.components.todoComponent.requestMoneyTransferPendingActionsActivity(
		            	requestMoneyData);
		        }
			}
			else {
				controllerChannel.emit('showTodoList');
			}
		};

		/**
		 * Render list of Todo elements and after clicking on See more
		 */
		this.renderToDoList = function(){
			var instanceName = 'todoComponent';
			this.executeCAV([
			    [this.components.qpLayoutComponent, 'payments/quickPay/qpLayout', {
			        'target': '#content'
			    }],
			    [this.components[instanceName], 'payments/quickPay/qpTodoList', {
			        'target': '#quickpay-inner-content'
			    }],
			    [this.components.declineComponent, 'payments/quickPay/qpDeclineOverlay', {
			        'target': '#overlayContainer'
			    }]
			]);


		};


		/**
		 * Initial load of todo items
		 */
		this.entry = function(){

			this.register.components(this, [{
                name: 'todoComponent',
                model: this.model.lens('todoComponent'),
                spec: todoSpec,
                methods: todoMethods
            },{
                name: 'declineComponent',
                model: this.model.lens('declineComponent'),
                spec: declineSpec,
                methods: declineMethods
            }]);
			this.components.todoComponent.showTransactions();
		};

	};
});
