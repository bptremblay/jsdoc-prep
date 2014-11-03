define(function(require) {

	return function CreditAccountActivityFilterView() {

		this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/creditAccountActivityFilter'));

		this.template = require('dashboard/template/myAccounts/creditAccountActivityFilter');

		this.init = function() {
			this.bridge.on('state/enableDateRange', function(data) {
				if (data.selectedTimePeriod === 'DATE_RANGE') {
					$('#dateRange').show();
				} else {
					$('#dateRange').hide();
				}
			});
		};
	};
});
