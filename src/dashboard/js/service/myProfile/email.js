/**
 * @author DST SFO 2
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module EmailService
 **/
define(function(require) {
	return function EmailService() {
		var dataTransform = require('dashboard/service/myProfile/dataTransform/email')();
		
		function getSettings(serviceName){
			return { 
				settings: {
					timeout: 30000,
					handleSuccess: function(data){
						switch(serviceName){
							case 'email.list':
								return dataTransform.transformEmailListService(data);
								break;
							default:
								break;
						}
					},
					handleError: function(){}
				}
			}
		};
		
		this.serviceCalls = {
			'myProfile.email.list.svc': getSettings('email.list')	
		};
	};
});