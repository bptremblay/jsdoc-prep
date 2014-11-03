define(function (require){
	return function MailingAddressListView(){

		this.bridge = this.createBridge(require('dashboard/view/webspec/myProfile/mailingAddressDeleteConfirmation'));

		this.template = require('dashboard/template/myProfile/mailingAddressDeleteConfirmation');

	};
});
