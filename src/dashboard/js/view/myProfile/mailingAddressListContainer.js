define(function (require){
  return function MailingAddressListContainerView(){

		this.init = function(){
			this.bridge = this.createBridge (require('dashboard/view/webspec/myProfile/mailingAddressListContainer'));
		}
		this.template = require('dashboard/template/myProfile/mailingAddressListContainer');

	};
})
