/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module logonPasswordReset
 */
define(function(require) {

	return function LogonUserIdFoundView() {
		var self = this,
			LogonUserIdFoundBridge = this.createBridgePrototype( require('logon/view/webspec/logonUserIdFound') );

		self.bridge = new LogonUserIdFoundBridge({
			targets: {
				passwordoption: 'input[name="passwordoption"]',
				userid: '#user_ids',
				exit_reset_password: '#exit_identification',
				next: '#request_identification_code'
			}
		});

		self.instanceName = 'logonuseridfound';
		self.type = 'view';

		// Set up essential view settings
		this.template = require('logon/template/logonUserIdFound');

		this.init = function() {
			// TODO this doesn't work here, move elsewhere
			//$('create_password').prop('checked', true);
			//$('#user_ids').prop('selectedIndex', 0);
		};


		this.onDataChange = function onDataChange() {
			this.rerender();
		};
	};
});
