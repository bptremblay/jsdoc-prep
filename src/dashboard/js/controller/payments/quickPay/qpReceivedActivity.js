/**
 * @fileoverview Defines QuickPay Money received activities controller.
 * @author Seymoun Kogan
 */
define(function(require) {

	var receivedActivitySpec = require('bluespec/quickpay_received_money_activity_temp'),
		receivedActivityMethods = require('dashboard/component/payments/quickPay/qpReceivedActivity');

	return function SendController() {
	    var controllerChannel = require('blue/event/channel/controller'),
	    	observable = require('blue/observable');
		/**
		 * Constructor. Listen for controller channel notifications
		 */
	    this.init = function(){

	   		this.model = observable.Model.combine({
                'receivedActivityComponent': {}
            });
			//create a blank component to render the QuickPay Layout
		    this.register.components(this, [{
		        name: 'qpLayoutComponent',
		        model: {},
		        spec: {'name': 'blankSpec'},
		        methods: {}
		    }]);

			this.controllerChannel = controllerChannel;


            controllerChannel.on({
                'showReceivedActivityList': function() {
                	this.entry();
                }.bind(this)
            });
            controllerChannel.on({
                'showSeeMoreItems': function() {
                	this.seeMore();
                }.bind(this)
            });
            controllerChannel.on({
                'renderReceivedList': function() {
                	this.renderReceivedList();
                }.bind(this)
            });
	    };
		/**
		 *  Landing page, Show list of received money transactions
		 */
		this.index = function() {
			controllerChannel.emit('showReceivedActivityList');
		};

		/**
		 * Upon landing, the user is redirected to this method.
		 * Loads all logged in user, Money received activities.
		 */
		this.entry = function(){

 	 		this.register.components(this, [{
                name: 'receivedActivityComponent',
                model: this.model.lens('receivedActivityComponent')	,
                spec: receivedActivitySpec,
                methods: receivedActivityMethods
            }]);

			var reqObj = {
				pageId : null
			};
			var req = this.model.lens('receivedActivityComponent').lens('reqObj').get();
			if(req){
				reqObj.pageId = req.pageId;
			}
			this.components.receivedActivityComponent.load(reqObj);
			this.executeCAV([
			    [this.components.qpLayoutComponent, 'payments/quickPay/qpLayout', {
			        'target': '#content'
			    }],
			    [this.components.receivedActivityComponent, 'payments/quickPay/qpReceivedActivity', {
			        'target': '#quickpay-inner-content'
			    }]
			]);
		};

		/**
		 * Display and append the next list after See more is clicked
		 */
		this.renderReceivedList = function(){
			this.executeCAV([this.components.receivedActivityComponent, 'payments/quickPay/qpReceivedActivity',
                   		{'target':'#quickpay-inner-content'}]);
		};
	};
});
