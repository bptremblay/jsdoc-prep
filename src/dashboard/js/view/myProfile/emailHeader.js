define(function (require){
	return function EmailHeaderView(){
		this.init = function() {
			this.bridge = this.createBridge(require('dashboard/view/webspec/myProfile/emailHeader'));
		};
		this.template = require('dashboard/template/myProfile/emailHeader');
	};
})