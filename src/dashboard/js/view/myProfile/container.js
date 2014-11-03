define(function (require){
	return function ProfileContainerView(){

		this.bridge = this.createBridge (require('dashboard/view/webspec/myProfile/container'));

		this.template = require('dashboard/template/myProfile/container');

		this.init = function() {
			$('.overlay, #pre-loader').hide();
		};
	};
})
