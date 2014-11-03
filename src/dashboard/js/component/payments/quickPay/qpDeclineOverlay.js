/**
 * @fileoverview Component implements QuickPay Decline Overlay.
 * @author Rufin SOH (o608924)
 */
define(function(require){
	var context = null, validate = null, self=this;
	var dynamicContentUtil = require('common/utility/dynamicContentUtil');

	/**
	 * Remove declined transaction row from model
	 * @function
	 * @param todoComponent context of the model
	 * @param paymentId Id to remove
	 */
	var removeSelectedRowFromTodo = function(todoComponent, paymentId){
		if(todoComponent){
			var arr = todoComponent.todolistview.tabledata[0].rows;
			var len = (arr)?arr.length:0;
			for (var i = 0; i < len; i++) {
				if(arr[i].paymentId === paymentId){
					arr.splice(i, 1);
					break;
				}

			}
		}
	};
	/**
	 * Confirm Decline action
	 * @function
	 * @param data data to call the service
	 * @param type transaction type: payment(settings.PENDING_ACTION_TYPE.PAYMENT)|request(settings.PENDING_ACTION_TYPE.REQUEST)
	 */
	var confirmDecline = function(data, type){
		// context.logger.info('qpDeclineOverlay component: confirmDeclineTransaction');

		var reqObj = context.model.lens('declineComponent.selectedRow').get();
		var todoComponent = context.model.lens('todoComponent').get();

		var req = {};
		// req.paymentId = reqObj.paymentId;
		if(type === context.dataTransform.getSettings().PENDING_ACTION_TYPE.PAYMENT){
			req.paymentId = reqObj.paymentId; //field requested for payment
			req.memo=(data)?data.memo:'';
		}else{
			req.requestId = reqObj.paymentId; //field requested for request
			req.reason=(data)?  '"' + data.memo + '"':'';
			req.amount= reqObj.serviceResult.amount;
			req.senderName= '"' +  reqObj.serviceResult.senderName + '"';
		}

		// req.personId=1;
		req.token=reqObj.token;

		context.qpServices.qpApi['quickpay.todo.decline.' + type](req).then(function(serviceResult){
			reqObj.serviceResult = serviceResult;
			removeSelectedRowFromTodo(todoComponent, reqObj.paymentId);
				context.controllerChannel.emit('showConfirmDecline',{'value': reqObj});

	   	}.bind(self),
		function(jqXHR) {
			self.logger.info('=== Failed in qpDeclineOverlay component call to service -qquickpay.todo.decline- jqXHR:', jqXHR);
		}.bind(self));
	};
	/**
	 * Close the overlay
	 */
	var closeOverlay = function(){
		// context.logger.info('qpDeclineOverlay component: confirmDeclineTransaction');
	 	context.controllerChannel.emit('closeDeclineOverlay');

	};
	return {
			/**
			 * Initialize
			 */
			init: function(){
				context = this.settings.context;
				validate = this.settings.validate;
				context.dataTransform.init(this.settings.context);
			},
			/**
			 * Cancel Decline
			 */
			doNotDeclineAcceptMoney: function(){
				// context.logger.info('qpDeclineOverlay component: doNotDeclineTransaction');
	 			closeOverlay();
			},
			/**
			 * Cancel Decline
			 */
			doNotDeclineEndMoney: function(){
				// context.logger.info('qpDeclineOverlay component: doNotDeclineTransaction');
	 			closeOverlay();
			},
			/**
			 * Confirm Decline accept action
			 */
			confirmDeclineAcceptMoney: function(data){
				// context.logger.info('qpDeclineOverlay component: confirmDeclineAcceptMoney');
				confirmDecline(this, context.dataTransform.getSettings().PENDING_ACTION_TYPE.PAYMENT);
				closeOverlay();
			},
			/**
			 * Confirm Decline send action
			 */
			confirmDeclineSendMoney: function(data){
				// context.logger.info('qpDeclineOverlay component: confirmDeclineSendMoney');
				confirmDecline(this, context.dataTransform.getSettings().PENDING_ACTION_TYPE.REQUEST);
				closeOverlay();
			}
	};
});
