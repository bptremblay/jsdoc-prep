define(function (require){
	return function ModalView() {

		this.bridge = this.createBridge(require('dashboard/view/webspec/myProfile/modal'));

		this.template = require('dashboard/template/myProfile/modal');
	}
})
