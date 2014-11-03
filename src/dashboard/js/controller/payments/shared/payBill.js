 /**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module PayBillsController
 */
 define(function(require) {
 	return function PayBillController() {
 		var controllerChannel = require('blue/event/channel/controller'),
 			observable = require('blue/observable'),
 			componentChannel = require('blue/event/channel/component');

		this.init = function(){

			// Common handler for payee select
			componentChannel.on({
				'payeeSelectCommonHandler': function(data) {
					this.handlePayeeSelect(data.payeeId);
				}.bind(this)
			});
		};

 		/**
         * Function for default action
         * @function index
         * @memberOf module:PayBillController
         */
        this.index = function(args) {
            this.model = observable.Model('payments');

			this.model.lens('previousPayeeType').set('NONE');

            var data = {
            	payeeId: ((args && args.payeeId) ? args.payeeId : '')
            };

            componentChannel.emit('payeeSelectCommonHandler', data);
            // this signal will make sure to intialize required components for the PayeeActivity;
            componentChannel.emit('initPayeeActivity');
            // this signal will make sure to intialize required components for the SinglePayment;
            componentChannel.emit('initSinglePayment');


            // Return the skeleton for the main Bill pay. This view has div targets for Schedule bill pay and Payee Activity
            return ['payments/shared/mainBillPay', this.model];
        };

        this.handlePayeeSelect = function(payeeId) {
        	var serviceData = {
                pageId: this.pageId ? this.pageId : '1'
            };

            // Make a service call to retreive list of payees
            this.singlePaymentServices.singlePayment.singlePaymentPayeeList(serviceData).then(
                function(data) {
                	var isMerchantPayee = false,
                		selectPayeeData = {
                			payeeId: payeeId,
                			previousPayeeType: this.model.lens('previousPayeeType').get(),
                			target: '#schedule-bill-pay-content' // Target div to be used for rendering component
                		};

                	// Find in service response if this payee is of type Merchant or On-Us.
                	if(payeeId) {
	                	data.merchantPayees.forEach(function(payee){
	                		if(payee.payeeId == payeeId){
	                			// Set selected Payee Name as part of message
	                			selectPayeeData.payeeName = payee.payeeName;

	                			if(!payee.onUsPayees){
	                				isMerchantPayee = true;
	                			}
	                		}
	                	}.bind(this));

	                	// Emit specific message with Payee Id and previousPayeeType
	                	if(isMerchantPayee) {
	                		// Send specific message for MBP
	                    	componentChannel.emit('merchantSelectPayee', selectPayeeData);
	                    	// Set value for previousPayeeType
	                    	this.model.lens('previousPayeeType').set('MBP');
	                	}
	                	else {
	                		// Send specific message for OUBP
	                		componentChannel.emit('onUsSelectPayee', selectPayeeData);
	                		// Set value for previousPayeeType
	                		this.model.lens('previousPayeeType').set('OUBP');
	                	}
					}
					else {
						// Send specific message for MBP
						componentChannel.emit('merchantSelectPayee', selectPayeeData);
						// Set value for previousPayeeType
                    	this.model.lens('previousPayeeType').set('MBP');
					}

                }.bind(this),
                function(jqXHR) {
                    context.logger.info("jqXHR : ", jqXHR);
                }.bind(this)
            );
        };
 	};
 });
