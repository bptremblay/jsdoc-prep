define(function (require){
	return function MailingAddressBrokerageAccountsView(){

		this.bridge = this.createBridge (require('dashboard/view/webspec/myProfile/mailingAddressBrokerageAccountsView'));

		this.template = require('dashboard/template/myProfile/mailingAddressBrokerageAccountsView');

	};
})
