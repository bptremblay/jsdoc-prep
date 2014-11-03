define(function (require){
	return function MailingAddressHeaderView(){
		var MailingAddressHeaderBridge = this.createBridgePrototype(require('dashboard/view/webspec/myProfile/mailingAddressHeader'));

		this.bridge = new MailingAddressHeaderBridge({
			targets: {
				addPermanentAddress: '#add-permanent-address',
				addTemporaryAddress: '#add-temporary-address'
			}
		});

		this.template = require('dashboard/template/myProfile/mailingAddressHeader');

	};
})
