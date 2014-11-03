define(function(require) {

	return function AccountActivityFilterView() {

		this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/filterAccountActivity'));

		this.template = require('dashboard/template/myAccounts/filterAccountActivity');

		this.init = function() {
			this.bridge.on('state/defualtDateRange', function() {
				$('#dataRangeDropdown option:first').attr('selected', 'selected');
			});
		};

	};
});
