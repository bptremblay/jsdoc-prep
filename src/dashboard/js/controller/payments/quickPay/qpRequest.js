/**
 * @fileoverview Defines QuickPay Request Money controller and actions.
 * @author Ajit Tambavekar (N471726)
 */
define(function(require){

	return function RequestController() {
		var controllerChannel = require('blue/event/channel/controller'),
			observable = require('blue/observable');

		/**
		 * Constructor - Creates empty models and setup listeners for the notifications
		 */
		this.init = function(){
			this.controllerChannel = controllerChannel;

			// create empty models
			this.model = observable.Model({
				'requestComponent': {
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
				'showRequestEntry': function(data) {
					this.showEntry(data);
				}.bind(this)
			});

			controllerChannel.on({
				'showRequestVerify': function(data) {
					this.showVerify(data);
				}.bind(this)
			});

			controllerChannel.on({
				'showRequestConfirm': function(data) {
					this.showConfirm(data);
				}.bind(this)
			});

			controllerChannel.on({
				'renderRequestEntry': function() {
					this.renderEntry();
				}.bind(this)
			});

			controllerChannel.on({
				'renderRequestVerify': function() {
					this.renderVerify();
				}.bind(this)
			});

			controllerChannel.on({
				'renderRequestConfirm': function() {
					this.renderConfirm();
				}.bind(this)
			});
		};

		/**
		 * Default controller action - sends notification showRequestEntry to show the entry form
		 */
		this.index = function() {
			controllerChannel.emit('showRequestEntry', {defaults: true});
		};

		this.registerComponent = function(){
			this.register.components(this, [{
				name: 'requestComponent',
				model: this.model.lens('requestComponent'),
				spec: require('bluespec/quickpay_request_money_temp'),
				methods: require('dashboard/component/payments/quickPay/qpRequest')
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
				this.components.requestComponent.initializeEntryForm();
				this.components.requestComponent.loadEntry(data);
			}
			else {	// render entry component with existing model (incase of Previous click)
				this.renderEntry();
				this.components.requestComponent.toggleTransactionAmountDecisionMaker();
			}
		};

		/**
		 * Registers verify component and calls load method of verify component.
		 * @param {data} Contains the form data collected at entry form
		 */
		this.showVerify = function(data){
            this.registerComponent();
			this.components.requestComponent.loadVerify(data);
		};

		/**
		 * Registers confirm component and calls load method of confirm component.
		 * @param {data} Contains the data model generated from Request add service response
		 */
		this.showConfirm = function(data){
            this.registerComponent();
			this.components.requestComponent.loadConfirm(data);
		};

		/**
		 * Renders the entry view with entry component.
		 */
		this.renderEntry = function(){
			this.executeCAV([
			    [this.components.qpLayoutComponent, 'payments/quickPay/qpLayout', {
			        'target': '#content'
			    }],
			    [this.components.requestComponent, 'payments/quickPay/qpRequestInput', {
			        'target': '#quickpay-inner-content'
			    }]
			]);
		};

		/**
		 * Renders the verify view with verify component.
		 */
		this.renderVerify = function(){
			this.executeCAV([this.components.requestComponent, 'payments/quickPay/qpRequestVerify', {'target':'#quickpay-inner-content'}]);
		};

		/**
		 * Renders the confirm view with confirm component.
		 */
		this.renderConfirm = function(){
			this.executeCAV([this.components.requestComponent, 'payments/quickPay/qpRequestConfirm', {'target':'#quickpay-inner-content'}]);
		};
	};
});
