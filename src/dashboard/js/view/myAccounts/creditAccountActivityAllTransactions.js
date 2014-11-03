define(function(require) {

	return function AccountActivityView() {

		this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/creditAccountActivityAllTransactions'));
		//render the default view
		this.template = require('dashboard/template/myAccounts/creditAccountActivityAllTransactions');

		this.init = function() {
			this.bridge.on('state/transactionDetailsHidden', function(data) {
                var detailsContentId = '#' + data.transactionId + '_detailsContent',
                	showDetailsId = '#' + data.transactionId + '_showDetails';

                //var escapeContentId = detailsContentId.substr(0, detailsContentId.indexOf('#')) + '\\' + detailsContentId.substr(detailsContentId.indexOf('#'), detailsContentId.length);
				$(detailsContentId).toggle();
				$('.' + data.transactionId).children('.fa').toggleClass('fa-arrow-up','fa-arrow-right');
                if ($(showDetailsId).text() === 'See details') {
                 	$(showDetailsId).text('Hide details');
                } else {
                 	$(showDetailsId).text('See details');
                }
            });
		};
	};
});
