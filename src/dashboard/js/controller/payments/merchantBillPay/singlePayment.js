/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module SinglePaymentController
 */
define(function(require) {
    return function SinglePaymentController() {

        var controllerChannel = require('blue/event/channel/controller'),
            observable = require('blue/observable'),
			componentChannel = require('blue/event/channel/component'),
			//Payment Component
			singlePaymentSpec = require('bluespec/merchant_bill_payment'),
			singlePaymentMethods = require('dashboard/component/payments/merchantBillPay/singlePayment'),
			dynamicContentUtil = require('common/utility/dynamicContentUtil');

        //initialize base model with empty
        this.init = function() {
        	this.controllerChannel = controllerChannel;
            this.componentChannel = componentChannel;
        	this.handleInitSinglePayment();

            controllerChannel.on({
                'setSinglePaymentPayeeList': function(data) {
                	this.loadPayeeList(data);
                }.bind(this)
            });
            //set funding acnts list
            controllerChannel.on({
                'setFundingAccounts': function(data) {
                	this.dataTransformSinglePayment.getSPPaymentOptionsDataModel(this.model.lens('singlePaymentEntryComponent').get(), data);
                	// TODO: Kaushik This is a hack to trigger bacon model update.
                	this.components.singlePaymentEntryComponent.fundingAccountDisplayNameWithBalance = this.model.lens('singlePaymentEntryComponent').lens('fundingAccountDisplayNameWithBalance').get();
                }.bind(this)
            });
            controllerChannel.on({
                'setSinglePaymentEntry': function(data) {
                	this.handleSetSinglePaymentEnter(data);
                }.bind(this)
            });
            controllerChannel.on({
                'setSinglePaymentVerify': function(data) {
                    this.handleSetSinglePaymentVerify(data);
                }.bind(this)
            });
            controllerChannel.on({
                'setSinglePaymentConfirm': function(data) {
                    this.handleSetSinglePaymentConfirm(data);
                }.bind(this)
            });

            controllerChannel.on({
                'setSinglePaymentExit': function() {
                    this.state('#/dashboard');
                }.bind(this)
            });

            componentChannel.on({
                'initSinglePayment': function() {
         		   this.handleInitSinglePayment();
                }.bind(this)
            });


            componentChannel.on({
            	'merchantSelectPayee': function(selectPayeeData) {
            		// Save the target div id in the controller to access while controller is alive.
            		this.targetDiv = selectPayeeData.target ? selectPayeeData.target : '#schedule-bill-pay-content';
            		if(selectPayeeData.payeeId === '' && selectPayeeData.previousPayeeType === 'NONE') {
        				// Register the entry component and then render the view using executeCAV,
        				// this is needed only when there is a route change to payBill.index without payee in context
        				// (example: from top-menu)
        				this.registerEntryComponent();
	            		if(selectPayeeData.payeeName) {
		            		this.components.singlePaymentEntryComponent.payeeNameValue = selectPayeeData.payeeName;
		            	}
        				// Load Payee List
			            this.components.singlePaymentEntryComponent.loadPayeeList();
            		}
            		else if(selectPayeeData.payeeId !== '' && (selectPayeeData.previousPayeeType === 'NONE' || selectPayeeData.previousPayeeType === 'OUBP')) {
            			// Register the entry component and then render the view using executeCAV
            			// this is needed only when there is a route change to payBill.index with payee in context (Add Payee flow)
            			// or drop-down selection change from non merchant payee to merchant payee
            			this.registerEntryComponent();
	            		if(selectPayeeData.payeeName) {
		            		this.components.singlePaymentEntryComponent.payeeNameValue = selectPayeeData.payeeName;
		            	}
            			// Load Payee List and select Payee
        				this.components.singlePaymentEntryComponent.payeeName = selectPayeeData.payeeId;
			            this.components.singlePaymentEntryComponent.loadPayeeList(selectPayeeData.payeeId);
            		}
            		else if(selectPayeeData.payeeId !== '' && selectPayeeData.previousPayeeType === 'MBP') {
            			// Register of entry component is not required because drop-down selection changed from merchant payee
            			// to another merchant payee
	            		if(selectPayeeData.payeeName) {
		            		this.components.singlePaymentEntryComponent.payeeNameValue = selectPayeeData.payeeName;
		            	}
            			// Load Accounts and Select Default Account
        				this.components.singlePaymentEntryComponent.payeeName = selectPayeeData.payeeId;
            			this.components.singlePaymentEntryComponent.loadAccountsAndActivity(selectPayeeData.payeeId);
            		}
            	}.bind(this)
            });

        };


    	/**
         * Function for reseting the model; has to be invoked everytime we load page for first time, initSinglePayment signal can be used to do the same.
         * @function handleInitSinglePayment
         * @memberOf module:PayBillController
         */
		this.handleInitSinglePayment = function() {
            var baseModel = {
                    payeeName: '',
                    payeeId: '',
                    payeeList: null,
                    fundingAcntsList: null,
                    fundingAccountDisplayNameWithBalance: '',
                    fundingAccountId: '',
                    transactionAmount: '',
                    transactionInitiationDate: '',
                    transactionDueDate: '',
                    memo: '',
                    formId: '',
                    transactionNumber: '',
                    flowStep: ''
                },
                singlePaymentEntryModel = observable.Model(baseModel),
                singlePaymentVerifyModel = observable.Model(baseModel),
                singlePaymentConfirmModel = observable.Model(baseModel);
            this.model = observable.Model.combine({
                'singlePaymentEntryComponent': singlePaymentEntryModel,
                'singlePaymentVerifyComponent': singlePaymentVerifyModel,
                'singlePaymentConfirmComponent': singlePaymentConfirmModel
            });
		};

    	/**
         * Function for default action
         * @function index
         * @memberOf module:PayBillController
         */
		this.index = function() {

		};

        /**
         * Function for registering instance of the Single Payment component for Entry view
         * @function registerEntryComponent
         * @memberOf module:PayBillController
         */
        this.registerEntryComponent = function() {
        	var observedModel = this.model.lens('singlePaymentEntryComponent');
        	this.register.components(this, [{
                name: 'singlePaymentEntryComponent',
                model: observedModel,
                spec: singlePaymentSpec,
                methods: singlePaymentMethods
            }]);
        };

        /**
         * Function to Load payee list drop down and the initial view
         * @function loadPayeeList
         * @memberOf module:PayBillController
         */
        this.loadPayeeList = function(data) {
        	// This is for Component spec to data Model binding
        	// TODO: more review needed
            this.model.lens('singlePaymentEntryComponent').set(this.dataTransformSinglePayment.getSPPayeeListDataModel(this.model.lens('singlePaymentEntryComponent').get(), data));
            // This is for View Model binding
            this.model.lens('singlePaymentEntryComponent').lens('singlePaymentForm').set(this.dataTransformSinglePayment.getSPEnterViewModel(this.model.lens('singlePaymentEntryComponent').get()));
            this.executeCAV([this.components.singlePaymentEntryComponent, 'payments/merchantBillPay/singlePaymentEnter', {'target':this.targetDiv}]);

            if(data.payeeId) {
            	//Select Payee in the dropdown
        		this.components.singlePaymentEntryComponent.output.emit('state', {
                    target: this,
                    value: 'setPayee',
                    payeeId: data.payeeId
                });

    			//Load Accounts and Select Default Account
    			this.components.singlePaymentEntryComponent.loadAccountsAndActivity(data.payeeId);
            }
        };

		/**
         * Function to load the Enter page of schedule a payment
         * @function handleSetSinglePaymentEnter
         * @memberOf module:PayBillController
         */
        this.handleSetSinglePaymentEnter = function() {
        	var observedModel = this.model.lens('singlePaymentEntryComponent');
            this.register.components(this, [{
                name: 'singlePaymentEntryComponent',
                model: observedModel,
                spec: singlePaymentSpec,
                methods: singlePaymentMethods
            }]);
            this.model.lens('singlePaymentEntryComponent').lens('singlePaymentForm').set(this.dataTransformSinglePayment.getSPEnterViewModel(this.model.lens('singlePaymentEntryComponent').get()));
            this.executeCAV([this.components.singlePaymentEntryComponent, 'payments/merchantBillPay/singlePaymentEnter', {'target':this.targetDiv}]);
        };

        /**
         * Function to load the Verify page of schedule a payment
         * @function handleSetSinglePaymentVerify
         * @memberOf module:PayBillController
         */
        this.handleSetSinglePaymentVerify = function(data) {
            //set entry payment data model for previous btn
            this.model.lens('singlePaymentEntryComponent').set(this.dataTransformSinglePayment.getSPEnterDataModel(this.model.lens('singlePaymentEntryComponent').get(), data.entryData));

            var observedModel = this.model.lens('singlePaymentVerifyComponent');

            //set verify payee data model
            var verifyModel = this.dataTransformSinglePayment.getSPVerifyDataModel(observedModel.get(), data);
            observedModel.set(verifyModel);

            this.register.components(this, [{
                name: 'singlePaymentVerifyComponent',
                model: observedModel,
                spec: singlePaymentSpec,
                methods: singlePaymentMethods
            }]);
            //store form_id from Validate service response to pass to Confirm service call
            this.components.singlePaymentVerifyComponent.formId = data.formId;
            //set verify payee form view model
            observedModel.lens('singlePaymentForm').set(this.dataTransformSinglePayment.getSPVerifyViewModel(observedModel));
            this.executeCAV([this.components.singlePaymentVerifyComponent, 'payments/merchantBillPay/singlePaymentVerify', {'target':this.targetDiv}]);
        };

        /**
         * Function to load the Confirm page
         * @function handleSetSinglePaymentConfirm
         * @memberOf module:PayBillController
         */
        this.handleSetSinglePaymentConfirm = function(data) {
            var observedModel = this.model.lens('singlePaymentConfirmComponent');
            //set confirm Single Payment data model
            observedModel.set(this.dataTransformSinglePayment.getSPConfirmDataModel(observedModel.get(), data));

            this.register.components(this, [{
                name: 'singlePaymentConfirmComponent',
                model: observedModel,
                spec: singlePaymentSpec,
                methods: singlePaymentMethods
            }]);
            //set confirm payee form view model
            observedModel.lens('singlePaymentForm').set(this.dataTransformSinglePayment.getSPConfirmViewModel(observedModel));
            this.executeCAV([this.components.singlePaymentConfirmComponent, 'payments/merchantBillPay/singlePaymentConfirm', {'target':this.targetDiv}]);
        };
    };
});
