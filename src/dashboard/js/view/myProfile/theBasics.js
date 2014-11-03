define(function(require) {

	return function BasicsView() {
		var BasicsBridge = this.createBridgePrototype(require('dashboard/view/webspec/myProfile/theBasics'));

		this.bridge = new BasicsBridge({
			targets: {}
		});

		this.instanceName = 'basics';
		this.type = 'VIEW';

		this.template = require('dashboard/template/myProfile/theBasics');
	
	};
});