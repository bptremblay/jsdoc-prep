define(function(require) {
	var context = null,
		localeSettings = require('blue/settings');
		controllerChannel = require('blue/event/channel/controller');

	return {
		init: function(){
			context = this.settings.context;
			this.payeeId = 0; //Used to get the default PayeeId and Payment Activity for that PayeeId
			this.specName = this.spec.name;
			this.paymentIndicator(0);

			//Initialize the component with Default PayeeId and Payment Activity
			this.requestAccountActivity(this.payeeId);
		},



		paymentIndicator: function(payeeIdVar) {
			context = this.settings.context;


			 $this = this;
            context.FormService.paymentsActivity['getFormDetails']({

            	payeeId: payeeIdVar

            }).then(function(data){

            // do something like this in handlebar : 	{{#if automatic}}{{auto_pay_on_label}}{{else}}{{auto_pay_off_label}}
            if(data.activated==false)
            {

			//this.model.lens('automaticPaymentEnrollmentStatus').set(data.activated)
            //this.model.lens('automaticPaymentEnrollmentStatus').set(false);
            this.model.lens('automaticPaymentEnrollmentStatus').set("OFF");


            }
            else
            {

            	this.model.lens('automaticPaymentEnrollmentStatus').set("ON");

            }
            console.log("this model: ", this.model.get());

            }.bind(this));


		},
		// Service call to retrieve paymentsActivity
		requestAccountActivity: function(payeeId) {
			serviceData = {
					'payeeId': payeeId
			};

			context.paymentsActivityServices.paymentsActivity.paymentsActivityList(serviceData).then(function(data) {
				if (data.code == "SUCCESS") {
					modelRef = context.model.lens('paymentsActivityComponent'); //need to pass in the labels
					var transformedData = context.dataTransformPaymentsActivity.getActivityViewModel(data, payeeId, modelRef);

		            controllerChannel.emit('trigger', {
		                target: this,
		                value: 'displayPaymentsActivity',
		                transformedData: transformedData
		            });
		            self.paymentIndicator(payeeId);
				}
			});
		},
		// Show paymentsDetail for each activities
		requestTransactionDetails: function() {
		},
		//this is the function where we set the data content / perform action for the automatic payment indicator
		paymentActivityMethod: function(data) {
			//this.automatic_payment_enrollment_status=data.txt;
			this.model.get().automatic_payment_enrollment_status = data.txt;
		},
		toggleTransactionDetails: function(data) {
		},
		// Print paymentsDetail
		printTransactionDetails: function() {
		},
		// Print paymentsDetail
		cancelTransaction: function() {
			//console.log('component: cancelTransaction!')
		}
	};
});
