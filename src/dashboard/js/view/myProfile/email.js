define(function (require){
	return function EmailView(){
		this.init = function() {
			this.bridge = this.createBridge(require('dashboard/view/webspec/myProfile/email'));
		};
		this.template = require('dashboard/template/myProfile/email');
	};
})