/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module payeeManualController
 * Will help add a payee Manually
 */
define(function(require) {
    return function payeeManualController() {

        var controllerChannel = require('blue/event/channel/controller'),
            observable = require('blue/observable'),
			componentChannel = require('blue/event/channel/component'),
			addPayeeManualSpec = require('bluespec/add_payee_profile'),
			addPayeeManualMethods = require('dashboard/component/payments/merchantBillPay/payeeManual'),
			dynamicContentUtil = require('common/utility/dynamicContentUtil');

        //initialize base model with empty
        this.init = function() {

            this.controllerChannel = controllerChannel;

        	  var baseModel ={
        		'payeeName':'',
        		'payeeNickname':'',
        		'mailingAddressLine1':'',
        		'mailingAddressLine2':'',
        		'city':'',
        		'state':'',
        		'zipCode':'',
        		'zipCodeExtension':'',
        		'phoneNumber':'',
        		'accountNumber':'',
        		'confirmedAccountNumber':'',
        		'accountNumberAvailable':false,
        		'noteForPayee':'',
        		'transactionProcessingLeadTime':'',
				'leadTime':'',
                'fundingAcntsList': null,
                'payeeGroupsList': null,
                'formId': '',
                'payeeId': '',
                'noSearchResult': false
        	};

	   		this.model = observable.Model.combine({
           		'payeeManualAddComponent': observable.Model(baseModel),
           		'payeeManualVerifyComponent': observable.Model(baseModel),
           		'payeeManualConfirmComponent': observable.Model(baseModel)
	        });

            //handle signal when user clicks Back button on Verify step of Add payee Manually flow.
            controllerChannel.on({
                    'setPayeeManualEntry': function(data) {
                        this.payeeManualEntry(data);
                    }.bind(this)
                });

            //handle signal when user clicks Next button on Entry step of Add payee Manually flow.
	        controllerChannel.on({
	            'setPayeeManualVerify': function(data) {
	            	this.payeeManualVerify(data);
	            }.bind(this)
	        });

            //handle signal when user clicks Add payee button on Verify step of Add payee Manually flow.
	        controllerChannel.on({
	            'setPayeeManualConfirm': function(data) {
	            	this.payeeManualConfirm(data);
	            }.bind(this)
	        });

	        componentChannel.on({
				'setPayeeNotFound': function(data) {
					this.handleSetPayeeNotFound(data);
				}.bind(this)
			});    

	        controllerChannel.on({
				'setCancelAddPayee': function() {
                    //Clear base model to make entry form blank
                    var observedModel = this.model.lens('payeeManualAddComponent');
                    observedModel.set(observable.Model(baseModel));
                    //redirect to Dashboard on click of Cancel
					this.handleSetCancelAddPayee();
				}.bind(this)
			});    
         };

    	/**
         * Function for default action
         * @function index
         * @memberOf module:payeeManualController
         */
        this.index = function() {
        //TODO: Milan 30-sep  Should we cache the service response for performance?
			this.myProfileServices.mailingAddress['myProfile.mailingAddress.stateList.svc']( { 'addressType':'USA' })
				.then(
            	function(stateListResp) {
            		this.model.lens('payeeManualAddComponent.stateList').set(stateListResp.states);
					this.payeeManualEntry();
	            }.bind(this),
                function(jqXHR) {
                	//TODO:  error handling future sprint.
                    this.logger.info('jqXHR : ', jqXHR);
                }.bind(this)
               );

        }.bind(this);

		/**
		 * This function will be invoked when there are no search results at payee.
		 * @function handleSetPayeeNotFound
		 * @memberOf module:payeeManualController
		 */
		this.handleSetPayeeNotFound = function(data) {
			this.model.lens('payeeManualAddComponent.noSearchResult').set(true);
			this.model.lens('payeeManualAddComponent.payeeName').set(data.payeeName);
			this.model.lens('payeeManualAddComponent.zipCode').set(data.zipCode);
			this.model.lens('payeeManualAddComponent.zipCodeExtension').set(data.zipCodeExtension);
			this.model.lens('payeeManualAddComponent.accountNumber').set(data.accountNumber);
			this.state('/dashboard/payeeManual');
		};

    	/**
         * Function for This is a callback function which should be called after you have stateList, this will render the Step 1: PayeeManual enrty page
         * @function payeeManualEntry
         * @memberOf module:payeeManualController
         */
        this.payeeManualEntry = function() {
            var observedModel = this.model.lens('payeeManualAddComponent');
            this.register.components(this, [{
                name: 'payeeManualAdd',
                model: observedModel,
                spec: addPayeeManualSpec,
                methods: addPayeeManualMethods
            }]);
            observedModel.lens('flowStep').set('Enter');
            //set  Enter payee form view model
			observedModel.lens('addPayeeForm').set(this.dataTransformMbp.getManualEnterViewModel(observedModel));
            this.executeCAV([this.components.payeeManualAdd, 'payments/merchantBillPay/payeeManualAdd', {'target':'#content'}]);
        }.bind(this);

    	/**
         * Function for handling signal  setPayeeManualVerify; this will pull up step 2 (verify)
         * @function payeeManualVerify
         * @memberOf module:payeeManualController
         */
        this.payeeManualVerify = function(data) {
            //Get previous entry data model for unit-testing purpose on click of Back button on Verify step
            var previousModel = this.model.lens('payeeManualAddComponent');
            this.model.lens('payeeManualAddComponent').set(this.dataTransformMbp.getManualEnterDataModel(previousModel.get(), data.entryData));

			var observedModel = this.model.lens('payeeManualVerifyComponent');
            //set search payee data model for previous btn
			observedModel.set(this.dataTransformMbp.getManualVerifyDataModel(observedModel.get(), data));

        	this.register.components(this, [{
                name: 'payeeManualVerify',
                model: observedModel,
                spec: addPayeeManualSpec,
                methods: addPayeeManualMethods
            }]);

        	//use dynamic settings for delivery method and lead time
        	try {
            	dynamicContentUtil.dynamicSettings.set(this.components.payeeManualVerify, 'transaction_processing_lead_time',  this.model.lens('payeeManualVerifyComponent').get().leadTime);
            	observedModel.lens('transactionProcessingLeadTime').set(observedModel.lens('transaction_processing_lead_time').get());
			}
			catch(err) {
			    this.logger.info(err);
			}
            //store form_id from Validate service response to pass to Confirm service call
            this.components.payeeManualVerify.formId = data.formId;
            observedModel.lens('flowStep').set('Verify');
            //set payee manual verify form view model
			observedModel.lens('payeeManualVerifyForm').set(this.dataTransformMbp.getManualVerifyViewModel(observedModel));

            this.executeCAV([this.components.payeeManualVerify, 'payments/merchantBillPay/payeeManualVerify', {target:'#content'}]);
        };

    	/**
         * Function for handling  setPayeeManualConfirm; this will pull up step 3 (confirm)
         * @function payeeManualConfirm
         * @memberOf module:payeeManualController
         */
        this.payeeManualConfirm = function(data) {

			var observedModel = this.model.lens('payeeManualConfirmComponent');
			//var observedAddModel = this.model.lens('payeeManualAddComponent');
			var model = observedModel.get();

			observedModel.set(this.dataTransformMbp.getManualConfirmDataModel(model, data));

        	this.register.components(this, [{
                name: 'payeeManualConfirm',
                model: observedModel,
                spec: addPayeeManualSpec,
                methods: addPayeeManualMethods
            }]);

            //use dynamic settings for delivery method and lead time
        	try {
            	dynamicContentUtil.dynamicSettings.set(this.components.payeeManualConfirm, 'transaction_processing_lead_time',  this.model.lens('payeeManualConfirmComponent').get().leadTime);
            	observedModel.lens('transactionProcessingLeadTime').set(observedModel.lens('transaction_processing_lead_time').get());
			}
			catch(err) {
			    this.logger.info(err);
			}
            //store payee_id from Confirm service response to route to Bill Pay with selected payeeId
            this.components.payeeManualConfirm.payeeId = data.payeeId;
            observedModel.lens('flowStep').set('Confirm');
            //set payee manual Confirm form view model
			observedModel.lens('payeeManualConfirmForm').set(this.dataTransformMbp.getManualConfirmViewModel(observedModel));

            this.executeCAV([this.components.payeeManualConfirm, 'payments/merchantBillPay/payeeManualConfirm', {target:'#content'}]);
        };

    	/**
         * Function for handling setCancelAddPayee; this will pull  route user to payBill
         * @function handleSetCancelAddPayee
         * @memberOf module:payeeManualController
         */
        this.handleSetCancelAddPayee = function() {
            this.state('#/dashboard');// TODO : Take the URL's from the Setting file.
        };
    };
});
