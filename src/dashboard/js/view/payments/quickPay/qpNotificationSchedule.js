define(function(require){
	return function NotificationScheduleView(){
		var self = this,
		    controllerChannel = require('blue/event/channel/controller');
		this.template = require('dashboard/template/payments/quickPay/qpNotificationSchedule');
		this.bridge = this.createBridge(require('dashboard/view/webspec/payments/quickPay/qpNotificationSchedule'));
	};
});
