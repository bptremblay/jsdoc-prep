/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module dashboard/controller/payments/quickPay/qp
 */
 define(function() {

	return function QpController() {
	    var controllerChannel = require('blue/event/channel/controller');

	    this.init = function(){
	    	this.controllerChannel = controllerChannel;
	    };

		/**
		 * QuickPay Index action: this is the router for the hash URI: e.g. #dashboard/qp, #dashboard/qp/send or #dashboard/qp/todo
		 * @function
		 * @param
		 * @example
		 *  #dashboard/qp -> send controller (qpSend)
		 *  #dashboard/qp/send -> send controller (qpSend)
		 *  #dashboard/qp/todo -> todo controller (qpTodo)
		 *	#dashboard/qp/request -> request controller (qpRequest)
		 *	#dashboard/qp/sentactivity -> request controller (qpSentActivity)
		 */
		this.index = function() {
			this.logger.info('qpSend.index(): hash:', window.location.hash);
			if (window.location.hash)
			{
				// check QuickPay enrollment status
				if (!this.isQuickPayEnrolled()){
			    	this.logger.info('qpEnroll.setup(): send hash:', hash);
			    	this.router('showEnrollSetup', {defaults: true});
				}
				else {
					//Expected pattern: e.g. #dashboard/qp, #dashboard/qp/send or #dashboard/qp/todo
					var hash = window.location.hash.substr(1);
					var hashValues = window.location.hash.substr(1).split('/');
					this.logger.info('qpSend.index(): hash:', hash, ' hashValues:', hashValues, ' length:', hashValues.length);
					if ( hashValues.length > 2)
					{

						var flow = hashValues[2];
						var indexOfRest = 3;
						//TODO: in case of this hash URI pattern: #/dashboard/qp/todo
						if (hashValues.length > 3 && hashValues[0] === '' && hashValues[1] === 'dashboard')
						{
							flow = hashValues[3];
							indexOfRest = 4;
						}

						switch (flow.toLowerCase()) {
						    case 'todo':
						    	this.logger.info('qpSend.index(): todo hash:', hash);
						    	//this.router('showTodoList', {});
						    	//
						    	var hashRest = hashValues.length > indexOfRest ?
						    			hashValues.slice(indexOfRest) : null;

						    	this.router('indexTodo', { data: hashRest });
						    	break;
						    case 'send':
						    	this.logger.info('qpSend.index(): send hash:', hash);
						    	this.router('showSendEntry', {defaults: true});
						    	break;
						    case 'request':
						    	this.logger.info('qpRequest.index(): request hash:', hash);
						    	this.router('showRequestEntry', {defaults: true});
						    	break;
						    case 'sentactivity':
						    	this.logger.info('qpSentActivity.index(): sentactivity hash:', hash);
						    	this.router('showSentActivityList', {});
						    	break;
						    case 'receivedactivity':
						    	this.logger.info('qpReceivedActivity.index(): receivedactivity hash:', hash);
						    	this.router('showReceivedActivityList', {});
						    	break;
						    case 'enroll':
						    	this.logger.info('qpEnroll.index(): request hash:', hash);
						    	this.router('showEnrollSetup', {defaults: true});
						    	break;
						    case '':
						    	this.logger.info('qpSend.index(): default hash with empty /:', hash);
	                        default:
						    	this.logger.info('qpSend.index(): default hash:', hash);
						        this.router('showSendEntry', {defaults: true});
						}

					} else {
						this.logger.info('qpSend.index(): qp hash:', hash);
						controllerChannel.emit('showSendEntry', {defaults: true});
					}

				}
			} else { //this should not occur. The user got here base on hash mapped to simpleUrlMapping
				this.logger.error('qpSend.index(): window.location.hash is null:', window.location);
			}
		};

        this.router = function(eventName, params) {
            controllerChannel.emit(eventName, params);
        };

		this.isQuickPayEnrolled = function(){
			// TODO: call component method to check QP entrollment status
			return true;
		};
	};
});
