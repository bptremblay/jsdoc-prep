define(function(require){
	var controllerChannel = require('blue/event/channel/controller'),
		context = null, validate = null;

	var getContext = function(){
		return this.context;
	};
	var getSettings = function(){
		var result = {};
		if(getContext().settings){
			result = getContext().settings.quickPay;
			if(!result){
				result = getContext().settings.get('quickPay');
			}
		}
		return (result) ? result : {};
	};

	return {
		init: function() {
			context = this.settings.context;
			validate = this.settings.validate;
			context.dataTransform.init(this.settings.context);
		},
		initializeNotificationSchedule: function(data){
 			this.model.lens('transactionNotifications.showNotificationDates').set(false);
 			if (data === 'verify' || data === 'confirm'){
 				this.model.lens('transactionNotifications.passedSendInput').set(true);
 			} else this.model.lens('transactionNotifications.passedSendInput').set(false);
 		},
		loadNotificationSchedule: function(data){
			var reqObj={},
				paymentsToShow = getSettings().NOTIFICATION_PAYMENTS_TO_SHOW;
			reqObj.secondDayOfMonth = data.secondDayOfMonth ? data.secondDayOfMonth : null;
			reqObj.dayOfMonth = data.dayOfMonth ? data.dayOfMonth : null;
			reqObj.dayOfWeek = data.dayOfWeek ? data.dayOfWeek : null;
			reqObj.frequency = data.frequency ? data.frequency : null;
			reqObj.month = data.month ? data.month : null;
			reqObj.numberOfPayments = data.numberOfPayments ? data.numberOfPayments : null;
			reqObj.openEnded = data.openEnded ? data.openEnded : false;
			reqObj.repeatingModelId = data.repeatingModelId ? data.repeatingModelId : null;
			reqObj.sendOnDate = data.sendOnDate ? data.sendOnDate: null;

			if (!reqObj.openEnded && (reqObj.numberOfPayments < paymentsToShow) && reqObj.numberOfPayments !== null){
				paymentsToShow = reqObj.numberOfPayments;
			}

		   context.qpServices.qpApi['quickpay.payment.repeating.datespreview.list'](reqObj).then(function(qpDatePreviewListServiceResult){
			 	var viewModel = context.dataTransform.getNotificationScheduleViewModel(qpDatePreviewListServiceResult, data.amount, paymentsToShow);
			 	this.model.lens('transactionNotifications').set(viewModel.transactionNotifications);
			 	}.bind(this),
			   function(jqXHR) {
                    this.logger.info('=== Failed in qpNotificationSchedule call to quickpay.payment.repeating.datespreview.list service-- jqXHR:', jqXHR);
                }.bind(this)
                );
 		},
		toggleTransactionNotifications: function(){
        	this.model.lens('transactionNotifications.showNotificationDates').set(!this.model.lens('transactionNotifications.showNotificationDates').get());
 		},
 		verifySendMoney: function(){
 		},
 		confirmSendMoney: function(){
 		},
 		intiateSendMoney: function(){
 		},
 		exitSendMoney: function(){
		},
		cancelSendMoney: function(){
		},
		sendMoreMoney: function(){
		},
		requestTransactionNotificationOptions: function(){
 		},
		requestTransactionRecurring: function(){
 		},
		toggleQuickpayNewsHelpMessage: function(){
 		},
		toggleMoneyTransferContactHelpMessage: function(){
 		},
		toggleTransactionNotificationOptionHelpMessage: function(){
 		},
		toggleTransactionNotificationDateHelpMessage: function(){
 		},
 		requestMoneyTransferContactInfo: function(){
 		},
 		toggleTransactionRecurring: function(){
 		}
 	};
 });
