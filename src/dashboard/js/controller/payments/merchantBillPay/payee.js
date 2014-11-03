/**
 *
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module PayeeController
 */

define(function(require) {

	return function PayeeController() {

		var controllerChannel = require('blue/event/channel/controller'),
			observable = require('blue/observable'),
			componentChannel = require('blue/event/channel/component'),
			payeeSpec = require('bluespec/payee_management'),
			payeeMethods = require('dashboard/component/payments/merchantBillPay/payee'),
			dynamicContentUtil = require('common/utility/dynamicContentUtil');

			//initialize base model with empty
			this.init = function() {
				var baseModel = {
					payeeName: '',
					payeeId: '',
					payeeNickname: '',
					mailingAddressLine1: '',
	        		mailingAddressLine2: '',
	        		city: '',
	        		state: '',
					zipCode: '',
					zipCodeExtension: '',
					postalAddress: '',
					phoneNumber: '',
					payeeAccountNumber: '',
					payeeConfirmedAccountNumber: '',
					fundingAccountDisplayName: '',
					fundingAccountNumber: '',
					payeeGroup: '',
					payeeCategoryId: '',
					transactionProcessingDeliveryMethod:'',
					flowStep: '',
					enterMode: '',
					postalAddressLine2: '',
					postalAddressLine3: '',
					payeeOptionsList:'',
					fundingAccountId:''
				},
				payeeEntryModel = observable.Model(baseModel),
				payeeVerifyModel = observable.Model(baseModel),
				payeeConfirmModel = observable.Model(baseModel);

				// Hack for unit test.
				this.controllerChannel = controllerChannel;
				this.componentChannel = componentChannel;

				this.model = observable.Model.combine({
					'payeeEntryComponent': payeeEntryModel,
					'payeeVerifyComponent': payeeVerifyModel,
					'payeeConfirmComponent': payeeConfirmModel
				});

				controllerChannel.on({
					'setPayeeEntry': function(data) {
						this.handleSetPayeeEntry(data);
					}.bind(this)
				});

				controllerChannel.on({
					'setPayeeVerify': function(data) {
						this.handleSetPayeeVerify(data);
	                }.bind(this)
	            });

	            controllerChannel.on({
					'setPayeeAddressManualEntry': function(data) {
						this.handleSetPayeeAddressEntry(data);
					}.bind(this)
				});

				controllerChannel.on({
					'setPayeeConfirm': function(data) {
						this.handleSetPayeeConfirm(data);
					}.bind(this)
				});

				controllerChannel.on({
					'setPayeeExit': function() {
					// TODO:  NOTE this is a dead listner, we are NOT emiting setPayeeExit signal and this block of code may be  dead please remove is not required.
						var observedModel = this.model.lens('payeeEntryComponent');
						observedModel.set(observable.Model(baseModel));
						controllerChannel.emit('setPayeeEntry');
					}.bind(this)
				});
			};

		/**
		 * Function for default action
		 * @function index
		 * @memberOf module:PayeeController
		 */
		this.index = function() {
			controllerChannel.emit('setPayeeEntry');
		};
		//Entry page display
		this.handleSetPayeeEntry = function() {
			var observedModel = this.model.lens('payeeEntryComponent');

			//TODO: Should this value be manually entered? need clarification
			observedModel.lens('flowStep').set('Enter');

			this.logger.debug('payeeEntryComponent : ', this.model.lens('payeeEntryComponent').get());

			this.register.components(this, [{
				name: 'payeeEntryComponent',
				model: observedModel,
				spec: payeeSpec,
				methods: payeeMethods
			}]);
			//set search payee form view model
			observedModel.lens('addPayeeForm').set(this.dataTransformMbp.getEnterViewModel(observedModel));

			this.executeCAV([this.components.payeeEntryComponent, 'payments/merchantBillPay/payeeEnter', {'target':'#content'}]);
		};

		//Enter Different address display
		this.handleSetPayeeAddressEntry = function(data) {
			var observedModel = this.model.lens('payeeVerifyComponent');
			//set state list dropdown for view model population
			observedModel.lens('stateList').set(observedModel.lens('payeeVerifyComponent.stateList').get());
			observedModel.lens('payeeAddressModule').set(this.dataTransformMbp.getVerifyAddressViewModel(observedModel));
		 	this.executeCAV([this.components.payeeVerifyComponent, 'payments/merchantBillPay/payeeVerifyAddress', {'target':'#payeeAddressLink .section'}]);
		}

		//Verify page display
		this.handleSetPayeeVerify = function(data, baseModel) {
			//set search payee data model for previous btn
			this.model.lens('payeeEntryComponent').set(this.dataTransformMbp.getEnterDataModel(observable.Model(baseModel), data.entryData));

			var observedModel = this.model.lens('payeeVerifyComponent');

			//TODO: Should this value be manually entered? need clarification
			observedModel.lens('flowStep').set('Verify');

			//set verify payee data model
			var verifyModel = this.dataTransformMbp.getVerifyDataModel(observedModel.get(), data);
			observedModel.set(verifyModel);

			this.register.components(this, [{
				name: 'payeeVerifyComponent',
				model: observedModel,
				spec: payeeSpec,
				methods: payeeMethods
			}]);

			this.components.payeeVerifyComponent.payeeCategoryId = verifyModel.payeeCategoryId;
			this.components.payeeVerifyComponent.fundingAccountId = verifyModel.fundingAccountId;

			//set verify payee form view model for mutiple vs exact payee match
			if (observedModel.lens('payeeOptionsList').get().length > 1){
				dynamicContentUtil.dynamicContent.set(this.components.payeeVerifyComponent, 'verify_add_payee_message', {count: observedModel.lens('payeeOptionsList').get().length}, 'multiple');
			}else{
				dynamicContentUtil.dynamicSettings.set(this.components.payeeVerifyComponent, 'verify_add_payee_message', 'single');
			}

			observedModel.lens('verifyPayeeForm').set(this.dataTransformMbp.getVerifyListViewModel(observedModel));
        	this.executeCAV([this.components.payeeVerifyComponent, 'payments/merchantBillPay/payeeListVerify', {'target':'#content'}]);
		};
		//Confirm page display
		this.handleSetPayeeConfirm = function(data) {
			var observedModel = this.model.lens('payeeConfirmComponent');
			var model = observedModel.get();

			//set confirm payee data model
			observedModel.set(this.dataTransformMbp.getConfirmDataModel(model, data));

			//TODO: Should this value be manually entered? need clarification
			observedModel.lens('flowStep').set('Confirm');

			this.register.components(this, [{
				name: 'payeeConfirmComponent',
				model: observedModel,
				spec: payeeSpec,
				methods: payeeMethods
			}]);

			var leadTime = data.leadTime === undefined || data.leadTime === null ? '' : data.leadTime;
			dynamicContentUtil.dynamicSettings.set(this.components.payeeConfirmComponent, 'transaction_processing_delivery_method', leadTime);
			observedModel.lens('paymentProcessingDeliveryMethod').set(observedModel.lens('transaction_processing_delivery_method').get());
			//set confirm payee form view model
			observedModel.lens('confirmPayeeForm').set(this.dataTransformMbp.getConfirmViewModel(observedModel));
			this.executeCAV([this.components.payeeConfirmComponent, 'payments/merchantBillPay/payeeConfirm', {'target':'#content'}]);
		};
	};

});
