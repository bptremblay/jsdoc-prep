/**
 * @fileoverview Component implements QuickPay Todo activities actions.
 * @author Diane Palla
 */
define(function(require) {

    // var controllerChannel = require('blue/event/channel/controller');
    var context = null,
        validate = null,
		formatUtility = require('dashboard/lib/quickPay/qpFormatUtility'),
		dynamicContentUtil = require('common/utility/dynamicContentUtil');

 	/**
	 * It stores the page state and allows to adjust it.
	 * @function
	 * @param currentPage
	 * @param numShowingItems number of items per page
	 * @param totalItems number of items total
	 */
    var PaginationHandler = function(currentPage, numShowingItems, totalItems) {

        this.currentPage = currentPage;
        this.nextPage = null;
        this.totalItems = typeof(totalItems) !== 'undefined' && totalItems ? totalItems : 0;
        this.numShowingItems = numShowingItems;

        this.setPage = function(cp, np) {
            this.currentPage = cp;
            this.nextPage = np;
        };
    };

    var pageH = null;
    var t = null;

 	/**
	 * Load todo items filtered by a 'data' criteria.
	 * @function
	 * @param data filter to apply
	 */
    var filter = function(data) {

        var showFilterByVal = typeof(data) !== 'undefined' ? data : null;
        return todoListSvcCall(null, showFilterByVal, true);
    };

 	/**
	 * Load next 50 todo items and append to current list.
	 * @function
	 */
    var listOrShowMore = function() {

        //Next page is what is requested, then pageH current page is updated after svc call.
        var requestPage = pageH !== null ? pageH.nextPage : null;

        var todolistview = context.model.lens('todoComponent.todolistview').get();
        var rows = todolistview && todolistview.tabledata &&
            todolistview.tabledata.length && todolistview.tabledata.length > 0 ? todolistview.tabledata[0].rows : null;
        var filterByShow = todolistview && todolistview.filterBy ? todolistview.filterBy : null;

        return todoListSvcCall(requestPage, filterByShow, false, rows);
    };

 	/**
	 * Call the service to load todo Items.
	 * @function
	 * @param pageNum load items for this page
	 * @param showFilterBy filter by this param
	 * @param isResetPage check if from See more we are reloading original list
	 * @param currentTableDataRows on clicking on See more, this is the existing list to append to
	 */
    var todoListSvcCall = function(pageNum, showFilterBy, isResetPage, currentTableDataRows) {

        //'ALL', 'INVOICES', 'PAYMENTS', 'REQUESTS'
        var showFilterByVal = typeof(showFilterBy) !== 'undefined' ? showFilterBy : null;

        var isResetPageVal = typeof(isResetPage) !== 'undefined' ? isResetPage : false;

        var svcRequest = {
            pageId: pageNum,
            filterBy: showFilterByVal
        };

        context.qpServices.qpApi['quickpay.todo.list'](svcRequest).then(function(todoListResult) {

                //this.logger.info('========================= here qpTodo.entry():', data);
                var toDoList = context.dataTransform.getToDoListViewModel.call(context.model.lens('declineComponent').get(), todoListResult, showFilterBy, currentTableDataRows);
                toDoList.todoListResult = todoListResult;
                t = todoListResult;
                toDoList.filterBy = showFilterByVal;

                var numShowingItems = typeof(todoListResult) !== 'undefined' && todoListResult !== null && todoListResult.actionItems ? todoListResult.actionItems.length : 0;
                if (isResetPageVal === true || pageH === null) {
                    pageH = new PaginationHandler(pageNum, numShowingItems);
                    pageH.nextPage = todoListResult.nextPageId;
                } else {
                    pageH.setPage(pageNum, todoListResult.nextPageId);
                    pageH.numShowingItems = numShowingItems;
                }
                context.model.lens('todoComponent.todolistview').set(toDoList);

                context.controllerChannel.emit('renderToDoList');




            }.bind(this),
            function() {
                //this.logger.info('========================= here qpTodo.entry().jqXHR:', jqXHR);

                var toDoList = context.dataTransform.getToDoListViewModel.call(context.model.lens('declineComponent').get(), null, null);
                context.model.lens('todoComponent.todolistview').set(toDoList);

                context.controllerChannel.emit('renderToDoList');

            }.bind(this)
        );
    };
    /**
	 * Decline action
	 * @function
	 * @param data data to call the service
	 * @param type transaction type: payment|request
	 */
    var declineTransaction = function(data, type) {
        //context.logger.info('qpSentActivity component: close');

		var reqObj   = JSON.parse(data); //getReq(data);
		var req = {};
		if(type === context.dataTransform.getSettings().PENDING_ACTION_TYPE.PAYMENT){
			req.paymentId = reqObj.paymentId; //field requested for payment
		}else{
			req.requestId = reqObj.paymentId; //field requested for request
		}

		context.qpServices.qpApi['quickpay.todo.decline.overlay.' + type](req).then(function(serviceResult){

			reqObj.serviceResult = serviceResult;

	 		var declineComponent = context.components.declineComponent;
	 		var todoComponent = context.components.todoComponent;
			var paymentAmount = formatUtility.formatCurrencyUtility.formatCurrency(serviceResult.amount, 2, ',', '(', '$', '0.0');

		    dynamicContentUtil.dynamicContent.setForBinding(declineComponent, 'confirm_decline_transaction_message_' + type, 'confirmDeclineTransactionMessage', {
		    	senderName: serviceResult.senderName,
		    	amount: paymentAmount
		    });
		    dynamicContentUtil.dynamicContent.setForBinding(todoComponent, 'transaction_declination_confirmation_message_' + type, 'transactionDeclinationConfirmationMessage', {
		    	senderName: serviceResult.senderName,
		    	amount: paymentAmount
		    });
		    dynamicContentUtil.dynamicContent.setForBinding(declineComponent, 'transaction_declination_reason_advisory_' + type, 'transactionDeclinationReasonAdvisory', {
		    	senderName: serviceResult.senderName
		    });

			reqObj.confirmMessage = declineComponent['confirmDeclineTransactionMessage'];
			reqObj.declineAdvisory = declineComponent['transactionDeclinationReasonAdvisory'];
			reqObj.declineMessage = todoComponent['transactionDeclinationConfirmationMessage'];


			dynamicContentUtil.dynamicContent.setForBinding(declineComponent, 'confirm_decline_transaction_label_' + type, 'confirm_decline_transaction_label', {});

			reqObj.declineBtn = declineComponent['confirmDeclineTransactionLabel'];
			reqObj.declineType = type;

			//set model for Overlay
		    context.model.lens('declineComponent.confirm_decline_transaction_label').set(declineComponent['confirmDeclineTransactionLabel']);
			context.model.lens('declineComponent.selectedRow').set(reqObj);
			//render in controller
 			context.controllerChannel.emit('showDeclineOverlay',{'value': reqObj});

	   	}.bind(this),
		function(jqXHR) {
			this.logger.info('=== Failed in qpTodo component call to service -qquickpay.todo.decline.overlay- jqXHR:', jqXHR);
		}.bind(this));

    };

    return {
 		/**
		 * Constructor - Initialize context and validate
		 */
        init: function() {
            context = this.settings.context;
            validate = this.settings.validate;
 			context.dataTransform.init(this.settings.context);
        },
 		/**
		 * Load the next set of transactions and append to the existing list
		 */
        seeMore: function(data) {
            return listOrShowMore(data);
        },
 		/**
		 * Send money to a chase or non-chase customer
		 */
        sendMoney: function() {
        	// context.logger.info('sendMoney');
        },
 		/**
		 * Load transactions and filter by d=irection selected
		 */
        filterByNotificationDirection: filter,
 		/**
		 * Load transactions
		 */
        showTransactions: function() {
        	// context.logger.info('showTransactions');
        	// Calling filter without a filter param means load initial page of transactions
        	return filter();
        },
  		/**
		 * Navigate to the dashboard
		 */
        exitPendingActionsActivity: function() {
            //context.logger.info('qpSentActivity component: close');
            context.state('#/dashboard');
        },
        /**
		 * Transfer Pending action
		 */
        requestMoneyTransferPendingActionsActivity: function(data) {
            //context.logger.info('qpSentActivity component: close');
            //context.controllerChannel.emit('sendMoneyFromRequestC', {data:data});
            //

        	var reqObj  = data&&data.paymentId ? data : JSON.parse(data); //getReq(data);

        	//Note: reqObj.paymentId must be defined.

            var getToDoListResultActionItem = function(reqIdObj) {

                var paymentId = reqIdObj.paymentId;
                var token = reqIdObj.token;

                var todoListResult =
                	context.model.lens('todoComponent.todolistview.todoListResult').get();

                if (todoListResult && todoListResult.actionItems &&
                	todoListResult.actionItems.length > 0) {

                    var aItem = null;

                    for (var i = 0; i < todoListResult.actionItems.length; i++) {
                        aItem = todoListResult.actionItems[i];
                        if (aItem !== null && aItem.id === paymentId &&
                        	(!token || (token && aItem.token === token) ) ) {
                            return aItem;
                        }
                    }
                }
                return null;
            };

        	var actionItem = getToDoListResultActionItem(reqObj);

        	var sendEntryObj = { 	defaults: true,
        							isFromSolicitedSendToDo: true,
        							actionItemId: reqObj.paymentId };
        	if(actionItem) {

        		sendEntryObj.actionItemId = actionItem.id;
        		sendEntryObj.tokenId =	 	actionItem.token;
        		sendEntryObj.amount = 		actionItem.amount;
        		sendEntryObj.recipientName =actionItem.senderName;

        	}

        	controllerChannel.emit('showSendEntry', sendEntryObj);

        },
         /**
		 * See details action
		 */
        requestTransactionDetails: function() {
            //context.logger.info('qpSentActivity component: close');
        },
         /**
		 * Hide All messages on click on a page
		 */
        hideAllMessages: function() {
            //context.logger.info('hideAllMessages component: close');
            alert('hideAllMessages');
        },
         /**
		 * Decline action for a request to accept money
		 */
        declineAcceptMoney: function(data) {
            //context.logger.info('qpSentActivity component: close');
			declineTransaction(data, context.dataTransform.getSettings().PENDING_ACTION_TYPE.PAYMENT);
        },
         /**
		 * Decline action for a request to send money
		 */
        declineSendMoney: function(data) {
            //context.logger.info('qpSentActivity component: close');
			declineTransaction(data, context.dataTransform.getSettings().PENDING_ACTION_TYPE.REQUEST);
        },
  		/**
		 * Accept money from a customer
		 */
        transactionDetails: function(){
            context.state('#/dashboard/qp/receivedactivity');
        },
        manageMyMoneyTransferProfile: function(){
            // context.state('#/dashboard/qp/receivedactivity');
        },

        acceptMoney: function(data) {

            var modelData = this.model.get();
            var reqObj = JSON.parse(data); //convert string into object

            context.qpServices.qpApi['quickpay.todo.accept'](reqObj).then(function(acceptMoneyResult) {
                    var successMessage = context.dataTransform.getSuccessMessage(acceptMoneyResult);
                    reqObj.message = successMessage;
                    // this.model.lens('todoComponent.successMessage').set(successMessage); NOT adding to view model, instead using jquery approach to build message in liu of the soon ractive ability.
                    context.controllerChannel.emit('showSuccess',{'value': reqObj});
                }.bind(this),
                function(jqXHR) {
                    this.logger.info('=== Failed in qpTodoList component AcceptMoney -- jqXHR:', jqXHR);
                }.bind(this)
            );
        },
        manageMyMoneyTransferProfile: function(){
        }
    };
});
