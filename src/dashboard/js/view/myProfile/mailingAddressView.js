define(function (require){
	return function MailingAddressView(){

		this.init = function(){
			this.bridge = this.createBridge (require('dashboard/view/webspec/myProfile/mailingAddress'));
		}
		
		this.template = require('dashboard/template/myProfile/mailingAddressView');
	};
})
