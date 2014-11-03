/**
 * @fileoverview Defines QuickPay Money Sent activities controller.
 * @author Rufin SOH (o608924)
 */
define(function(require){

	var sentActivitySpec = require('bluespec/quickpay_sent_money_activity_temp'),
		sentActivityMethods = require('dashboard/component/payments/quickPay/qpSentActivity');

	return function SendController() {
	    var controllerChannel = require('blue/event/channel/controller'),
	    	observable = require('blue/observable');
		/**
		 * Constructor. Listen for controller channel notifications
		 */
	    this.init = function(){

	   		this.model = observable.Model.combine({
                'sentActivityComponent': {}
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
                'showSentActivityList': function() {
                	this.entry();
                }.bind(this)
            });
            controllerChannel.on({
                'showSeeMore': function() {
                	this.seeMore();
                }.bind(this)
            });
            controllerChannel.on({
                'renderSentActivitiesList': function() {
                	this.renderSentActivitiesList();
                }.bind(this)
            });

	    };

		/**
		 * landing page #dashboard/qp/sentactivity
		 */
		this.index = function() {
			controllerChannel.emit('showSentActivityList');
		};

		/**
		 * Upon landing, the user is redirected to this method.
		 * Loads all logged in user, Money sent activities.
		 */
		this.entry = function(){

 	 		this.register.components(this, [{
                name: 'sentActivityComponent',
                model: this.model.lens('sentActivityComponent')	,
                spec: sentActivitySpec,
                methods: sentActivityMethods
            }]);

			var reqObj = {
				pageId : null
			};
			var req = this.model.lens('sentActivityComponent').lens('reqObj').get();
			if(req){
				reqObj.pageId = req.pageId;
			}
			this.components.sentActivityComponent.load(reqObj);
			this.executeCAV([
			    [this.components.qpLayoutComponent, 'payments/quickPay/qpLayout', {
			        'target': '#content'
			    }],
			    [this.components.sentActivityComponent, 'payments/quickPay/qpSentActivity', {
			        'target': '#quickpay-inner-content'
			    }]
			]);
		};

		/**
		 * Display and append the next list
		 */
		this.renderSentActivitiesList = function(){
			this.executeCAV([this.components.sentActivityComponent, 'payments/quickPay/qpSentActivity',
                   		{'target':'#quickpay-inner-content'}]);
		};
	};
});
