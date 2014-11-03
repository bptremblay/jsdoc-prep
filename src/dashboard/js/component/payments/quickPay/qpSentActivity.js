/**
 * @fileoverview Component implements QuickPay Money Sent activities actions.
 * @author Rufin SOH (o608924)
 */
define(function(){
	var context = null, validate = null;

	/**
	 * load money sent activities from the service and append to existing appendToList.
	 * @function
	 * @param {{filterBy : '',pageId : 1,personId : 1}}  reqObj the parameters used to call the service
	 * @param {Object[]} appendToList existing list to append the result to, will be populated when calling 'see more'
	 */
	var  loadActivities = function(reqObj, appendToList){
		// context.logger.info('qpSentActivity component: loadActivities');

		context.qpServices.qpApi['quickpay.sentactivity.list'](reqObj).then(function(sentActivityResult){
			var viewModel = context.dataTransform.getSentActivityListModel(sentActivityResult, appendToList);

			reqObj.pageId = sentActivityResult.nextPageId;
			context.model.lens('sentActivityComponent.actions').set(viewModel.actions);
		    context.model.lens('sentActivityComponent.reqObj').set(reqObj);
		    context.model.lens('sentActivityComponent.tabledata').set(viewModel.tabledata);

 			context.controllerChannel.emit('renderSentActivitiesList');
	   	}.bind(this),
		function(jqXHR) {
			this.logger.info('=== Failed in qpSentActivity component call to service -quickpay.sentactivity.list - jqXHR:', jqXHR);
		}.bind(this));
	};


	return {
			init: function(){
				context = this.settings.context;
				validate = this.settings.validate;
				context.dataTransform.init(this.settings.context);
			},
			seeMore: function(){
				// context.logger.info('qpSentActivity component: seeMore');

				var reqObj = context.model.lens('sentActivityComponent.reqObj').get();
				var model = context.model.lens('sentActivityComponent').get();
				var rows = model.tabledata[0].rows;
				this.loadActivities(reqObj, rows);
			},
			exitSentMoneyActivity: function(){
				// context.logger.info('qpSentActivity component: close');
			    context.state('#/dashboard');
			},
			load: function(reqObj){
				// context.logger.info('qpSentActivity component: Load');
				this.loadActivities(reqObj, undefined);
			},
			 /**
			 * Request money transfer from a customer
			 */
			requestMoneyTransferActivity: function(){
				// context.logger.info('qpSentActivity component: requestMoneyTransferActivity');
			},
			/**
			 * Show details of the transaction
			 */
			requestTransactionDetails: function(){
				// context.logger.info('qpSentActivity component: requestTransactionDetails');
			},
			/**
			 * Print details of the transaction
			 */
			printTransactionDetails: function(){
				// context.logger.info('qpSentActivity component: printTransactionDetails');
			},
			/**
			 * Research on the transaction
			 */
			requestTransactionInquiry: function(){
				// context.logger.info('qpSentActivity component: requestTransactionInquiry');
			},
			/**
			 * modify the transaction
			 */
			editTransaction: function(){
				// context.logger.info('qpSentActivity component: editTransaction');
			},
			/**
			 * cancel the transaction
			 */
			cancelTransaction: function(){
				// context.logger.info('qpSentActivity component: cancelTransaction');
			},
			loadActivities: loadActivities
	};
});
