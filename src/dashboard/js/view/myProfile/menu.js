define(function (require){
  return function ProfileMenuView(){

	this.init = function(){
		this.bridge = this.createBridge (require('dashboard/view/webspec/myProfile/menu'));
	};
	this.template = require('dashboard/template/myProfile/menu');

  };
})
