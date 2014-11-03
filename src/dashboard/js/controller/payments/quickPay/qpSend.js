/**
 * @fileoverview Defines QuickPay Send Money controller and actions.
 * @author Ajit Tambavekar (N471726)
 */
define(function(require){

	return function SendController() {
	    var controllerChannel = require('blue/event/channel/controller'),
	    	observable = require('blue/observable');

		/**
		 * Constructor - Creates empty models and setup listeners for the notifications
		 */
	    this.init = function(){
	    	this.controllerChannel = controllerChannel;

	    	// create models
			this.model = observable.Model({
				'sendComponent': {
				}
			});
			//create a blank component to render the QuickPay Layout
		    this.register.components(this, [{
		        name: 'qpLayoutComponent',
		        model: {},
		        spec: {'name': 'blankSpec'},
		        methods: {}
		    }]);

			// listen for notifications and call associated methods
            controllerChannel.on({
                'showSendEntry': function(data) {
                	this.showEntry(data);
                }.bind(this)
            });

            controllerChannel.on({
                'showSendVerify': function(data) {
                	this.showVerify(data);
                }.bind(this)
            });

            controllerChannel.on({
                'showSendConfirm': function(data) {
                	this.showConfirm(data);
                }.bind(this)
            });
            controllerChannel.on({
            	'updateNotificationSchedule':function(data) {
            		this.updateNotificationSchedule(data);
            	}.bind(this)
            });

            controllerChannel.on({
                'renderSendEntry': function() {
                	this.renderEntry();
                }.bind(this)
            });

            controllerChannel.on({
                'renderSendVerify': function() {
                	this.renderVerify();
                }.bind(this)
            });

            controllerChannel.on({
                'renderSendConfirm': function() {
                	this.renderConfirm();
                }.bind(this)
            });

            controllerChannel.on({
                'renderRepeatingPaymentOptions': function(inputData) {
                	this.renderRepeatingPaymentOptions(inputData);
                }.bind(this)});

            controllerChannel.on({
            	'renderDuplicatePaymentOverlay' : function() {
            		this.renderOverlay();
            	}.bind(this)

            });
            //This is a requirement to handle server side errors for Handlebars
            controllerChannel.on({
            	'qp_sendServerValidationError' : function(data) {
            		this.context.logger.info( '***************** qpSend controller: targetId=>', data.targetId );
            		this.renderServerErrorMessage(data.targetId);
            	}.bind(this)

            });
	    };

		/**
		 * Default controller action - sends notification showSendEntry to show the entry form
		 */
		this.index = function() {
			controllerChannel.emit('showSendEntry', {defaults: true});
		};

		this.registerComponent = function(){
			this.register.components(this, [{
				name: 'sendComponent',
				model: this.model.lens('sendComponent'),
				spec: require('bluespec/quickpay_send_money_temp'),
				methods: require('dashboard/component/payments/quickPay/qpSend')
			}]);

			this.register.components(this, [{
				name: 'sendRepeatingPaymentComponent',
				model: this.model.lens('sendComponent'),
				spec: require('bluespec/quickpay_send_money_temp'),
				methods: require('dashboard/component/payments/quickPay/qpSend')
			}]);

			this.register.components(this, [{
				name: 'notificationScheduleComponent',
				model: this.model.lens('notificationScheduleComponent'),
				spec: require('bluespec/quickpay_send_money_temp'),
				methods: require('dashboard/component/payments/quickPay/qpNotificationSchedule')
			}]);
		};

		/**
		 * Registers entry component and either loads or renders the entry component.
		 * @param {data.defaults} True indicates that entry component has to be loaded with default model
		 * 		otherwise render component with the existing model.
		 */
		this.showEntry = function(data){
            this.registerComponent();

			// load the entry component with default model
			if (data&&data.defaults) {

				this.components.sendComponent.initializeEntryForm(data);
				this.components.sendComponent.loadEntry(data);
			}
			else {	// render entry component with existing model (incase of Previous click)
				this.renderEntry();
			}
		};

		/**
		 * Registers verify component and calls load method of verify component.
		 * @param {data} Contains the form data collected at entry form
		 */
		this.showVerify = function(data){
            this.registerComponent();
            this.components.sendComponent.loadVerify(data);
		};

		/**
		 * Registers confirm component and calls load method of confirm component.
		 * @param {data} Contains the data model generated from Request add service response
		 */
		this.showConfirm = function(data){
            this.registerComponent();
            this.components.sendComponent.loadConfirm(data);
		};

		/**
		 * Updates the notification schedule
		 */
		this.updateNotificationSchedule = function(data) {
			this.components.notificationScheduleComponent.loadNotificationSchedule(data);
		};
		/**
		 * Renders the entry view with entry component.
		 */
		this.renderEntry = function(){
			this.executeCAV([
				[this.components.qpLayoutComponent, 'payments/quickPay/qpLayout', {'target': '#content'}],
				[this.components.sendComponent, 'payments/quickPay/qpSendInput', {'target':'#quickpay-inner-content'}],
				[this.components.sendRepeatingPaymentComponent, 'payments/quickPay/qpRepeatingPaymentOptions', {'target':'#repeatingPaymentContainer'}]
			]);
			if (this.components.sendComponent.transactionRecurring === 'true'){
				this.components.notificationScheduleComponent.initializeNotificationSchedule('input');
				this.executeCAV([this.components.notificationScheduleComponent, 'payments/quickPay/qpNotificationSchedule', {'target':'#notificationScheduleContainer', 'react': true}]);
			}
		};

		/**
		 * Renders the verify view with verify component.
		 */
		this.renderVerify = function(){
			var renderList = [];
        	renderList.push([this.components.sendComponent, 'payments/quickPay/qpSendVerify', {'target':'#quickpay-inner-content'}]);

        	if (this.components.sendComponent.transactionRecurring === 'true'){
				this.components.notificationScheduleComponent.initializeNotificationSchedule('verify');
				renderList.push([this.components.notificationScheduleComponent, 'payments/quickPay/qpNotificationSchedule', {'target':'#notificationScheduleContainer', 'react': true}]);
			}
            this.executeCAV(renderList);
		};

		/**
		 * Renders the confirm view with confirm component.
		 */
		this.renderConfirm = function(){
        	var renderList = [];
        	renderList.push([this.components.sendComponent, 'payments/quickPay/qpSendConfirm', {'target':'#quickpay-inner-content'}]);

        	 if (this.components.sendComponent.transactionRecurring === 'true'){
            	this.components.notificationScheduleComponent.initializeNotificationSchedule('confirm');
          		renderList.push([this.components.notificationScheduleComponent, 'payments/quickPay/qpNotificationSchedule', {'target':'#notificationScheduleContainer', 'react': true}]);
          	}
          	this.executeCAV(renderList);
		};
		this.renderRepeatingPaymentOptions = function(inputData){
			this.components.sendComponent.initializeRepeatingPaymentFormElements();
			var renderList = [];
			renderList.push([this.components.sendComponent, 'payments/quickPay/qpRepeatingPaymentOptions', {'target':'#repeatingPaymentContainer'}]);

			if (inputData.transactionRecurring){
				this.components.notificationScheduleComponent.transactionNotifications = [];
				this.components.notificationScheduleComponent.initializeNotificationSchedule('input');
				this.components.notificationScheduleComponent.transactionNotifications.passedSendInput = false;

				renderList.push([this.components.notificationScheduleComponent, 'payments/quickPay/qpNotificationSchedule', {'target':'#notificationScheduleContainer', 'react': true}]);
			}
            this.executeCAV(renderList);
        };
		this.renderOverlay  =function() {
			this.executeCAV([this.components.sendComponent, 'payments/quickPay/qpSendDuplicate', {target:'#duplicateOverlay'}]);
		};
		/**
		 * Renders the error message view with the updated component.This is a requirement to handle server side errors for Handlebars
		 */
		this.renderServerErrorMessage = function(targetId) {
            this.executeCAV([this.components.sendComponent, 'payments/quickPay/qpServerErrorMessage', {'target':targetId}]);
		};

	};
});
