define(function (require){
	return function ContextualHelpView(){

		this.init = function(){
			this.bridge = this.createBridge (require('dashboard/view/webspec/myProfile/contextualHelp'));
		}
		this.template = require('dashboard/template/myProfile/contextualHelp');

	};
})
