define(function (require){
  return function buttonDropDownView(){

	this.bridge = this.createBridge(require('dashboard/view/webspec/myProfile/buttonDropDown'));

	this.template = require('dashboard/template/myProfile/buttonDropDown');

	this.init = function() {

	};
  };
})
