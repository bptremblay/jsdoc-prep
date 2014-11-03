/**
 * @fileoverview Defines QuickPay Enrollment controller and actions.
 * @author Ajit Tambavekar (N471726)
 */
 define(function(require){

	return function EnrollController(){
		var controllerChannel = require('blue/event/channel/controller'),
			observable = require('blue/observable');

		/**
		 * Constructor - Creates empty models and setup listeners for the notifications
		 */
		this.init = function(){
			this.controllerChannel = controllerChannel;

			// create empty model
			this.model = observable.Model({
				'enrollComponent': {
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
				'showEnrollSetup': function(data) {
					this.showSetup(data);
				}.bind(this)
			});

			controllerChannel.on({
				'showEnrollEntry': function(data) {
					this.showEntry(data);
				}.bind(this)
			});

			controllerChannel.on({
				'showEnrollVerify': function(data) {
					this.showVerify(data);
				}.bind(this)
			});

			controllerChannel.on({
				'showEnrollConfirm': function(data) {
					this.showConfirm(data);
				}.bind(this)
			});

			controllerChannel.on({
				'renderEnrollSetup': function() {
					this.renderSetup();
				}.bind(this)
			});

			controllerChannel.on({
				'renderEnrollEntry': function() {
					this.renderEntry();
				}.bind(this)
			});

			controllerChannel.on({
				'renderEnrollVerify': function() {
					this.renderVerify();
				}.bind(this)
			});

			controllerChannel.on({
				'renderEnrollConfirm': function() {
					this.renderConfirm();
				}.bind(this)
			});


			controllerChannel.on({
				'triggerVerifyService': function(data) {
					this.triggerVerifyService(data);
				}.bind(this)
			});

		};

		this.index = function(){
			controllerChannel.emit('showEnrollSetup', {defaults: true});
		};

		this.registerComponent = function(){
			this.register.components(this, [{
				name: 'enrollComponent',
				model: this.model.lens('enrollComponent'),
				spec: require('bluespec/quickpay_enrollment'),
				methods: require('dashboard/component/payments/quickPay/qpEnroll')
			}]);
		};
		this.triggerVerifyService = function(data){
			// this.registerComponent();
			this.components.enrollComponent.triggerVerifyService(data);
			// this.renderVerify();
		};

		this.showSetup = function(data){
			this.registerComponent();
			this.components.enrollComponent.loadSetup(data);
		};

		this.showEntry = function(data){
			this.registerComponent();
			this.components.enrollComponent.loadEntry(data);
		};

		this.showVerify = function(data){
			this.registerComponent();
			this.components.enrollComponent.loadVerify(data);
		};

		this.showConfirm = function(data){
			this.registerComponent();
			this.components.enrollComponent.loadConfirm(data);
		};

		/**
		 * Renders the setup/inital view for enrollment.
		 */
		this.renderSetup = function() {
		    this.executeCAV([
		        [this.components.qpLayoutComponent, 'payments/quickPay/qpLayout', {
		            'target': '#content'
		        }],
		        [this.components.enrollComponent, 'payments/quickPay/qpEnrollSetup', {
		            'target': '#quickpay-inner-content'
		        }]
		    ]);
		};
		this.renderEntry = function(){
			    this.executeCAV([this.components.enrollComponent, 'payments/quickPay/qpEnrollInput', {
			            'target': '#quickpay-inner-content',
			            'react': true
			        }]
			    );
			//this.executeCAV([this.components.enrollComponent, 'payments/quickPay/qpEnrollInput', {'target':'#quickpay-inner-content', 'react': true}]);

		};

		this.renderVerify = function(){
			this.executeCAV([this.components.enrollComponent, 'payments/quickPay/qpEnrollVerify', {'target':'#quickpay-inner-content'}]);
		};

		this.renderConfirm = function(){
			this.executeCAV([this.components.enrollComponent, 'payments/quickPay/qpEnrollConfirm', {'target':'#quickpay-inner-content'}]);
		};
	};
});
