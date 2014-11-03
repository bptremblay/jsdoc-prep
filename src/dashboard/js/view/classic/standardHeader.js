define(function(require) {

	return function StandardHeaderView() {
		this.template = require('dashboard/template/classic/standardHeader');

		//**TODO**
		// Started to work on executeCAV for standardHeader and had to back it out for now because of a presumed target conflict
		// due to using 2 different view engines.
		// This will be revisited when we move to ractive view engine.

		//var standardHeaderBridge = this.createBridgePrototype(require('dashboard/view/webspec/classic/standardHeader')),
    	//    self = this;

		// Initialize the view and set up the event manager
		this.init = function() {

			// Bridge Configuration
			/*	self.bridge = new standardHeaderBridge ({
					targets: {}
				});
			*/
		};

		this.onDataChange = function onDataChange() {
			this.rerender();
		};
	};
});
