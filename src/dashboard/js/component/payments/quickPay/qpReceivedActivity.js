/**
 * @fileoverview Component implements QuickPay Money received activities.
 * @author Seymoun Kogan
 */
define(function(){
	var context = null, validate = null;

	/**
	 * load activities from the service and append to existing appendToList.
	 * @function
	 * @param {{filterBy : '',pageId : 1,personId : 1}}  reqObj the parameters used to call the service
	 * @param {Object[]} appendToList existing list to append the result to, will be populated when calling 'see more'
	 */
	var  loadActivities = function(reqObj, appendToList){
		// context.logger.info('qpReceivedActivity component: loadActivities');

		context.qpServices.qpApi['quickpay.receivedactivity.list'](reqObj).then(function(receivedActivityResult){
			var viewModel = context.dataTransform.getReceivedActivityListModel(receivedActivityResult, appendToList);

			reqObj.pageId = receivedActivityResult.nextPageId;
			context.model.lens('receivedActivityComponent.actions').set(viewModel.actions);
		    context.model.lens('receivedActivityComponent.reqObj').set(reqObj);
		    context.model.lens('receivedActivityComponent.tabledata').set(viewModel.tabledata);

 			context.controllerChannel.emit('renderReceivedList');

    	}.bind(this),
		function(jqXHR) {
			this.logger.info('=== Failed in qpReceivedActivity component call to service -quickpay.receivedactivity.list - jqXHR:', jqXHR);
		}.bind(this));
	};


	return {
	 		/**
			 * Constructor - Initialize context and validate
			 */
			init: function(){
				context = this.settings.context;
				validate = this.settings.validate;
				context.dataTransform.init(this.settings.context);
			},
	 		/**
			 * Load the next set of transactions and append to the existing list
			 */
			seeMore: function(){
				// context.logger.info('qpReceivedActivity component: seeMore');
				var reqObj = context.model.lens('receivedActivityComponent.reqObj').get();
				var model = context.model.lens('receivedActivityComponent').get();
				var rows = model.tabledata[0].rows;
				this.loadActivities(reqObj, rows);
			},
			 /**
			 * Request money transfer from a customer
			 */
			requestMoneyTransferActivity: function(){
				// context.logger.info('qpReceivedActivity component: requestMoneyTransferActivity');
			},
			/**
			 * Show details of the transaction
			 */
			requestTransactionDetails: function(){
				// context.logger.info('qpReceivedActivity component: requestTransactionDetails');
			},
			/**
			 * Print details of the transaction
			 */
			printTransactionDetails: function(){
				// context.logger.info('qpReceivedActivity component: printTransactionDetails');
			},
	  		/**
			 * Navigate to the dashboard
			 */
			exitReceivedMoneyActivity: function(){
				// context.logger.info('qpReceivedActivity component: exitReceivedMoneyActivity');
			    context.state('#/dashboard');
			},
	 		/**
			 * Load transactions
	 		 * @param {{filterBy : '',pageId : 1,personId : 1}}  reqObj the parameters used to call the service
			 */
			load: function(reqObj){
				// context.logger.info('qpReceivedActivity component: Load');
				this.loadActivities(reqObj, undefined);
			},
			/**
			 * load activities from the service and append to existing appendToList.
			 * @function
			 */
			loadActivities: loadActivities
	};
});
