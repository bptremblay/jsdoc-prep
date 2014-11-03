define(function() {
	return function payeeActivity() {
		var svcProps = {
			settings: {
				timeout: 8000,
				type: 'POST',
				dataType: 'json',
				xhrFields: {
					withCredentials: true
				}
			}
		};
		this.serviceCalls = {
			payeeActivityList:svcProps,
			payeeActivityDetail:svcProps,
			editTransactionList:svcProps,
			editTransactionVerify:svcProps,
			editTransactionConfirm:svcProps,
			merchantPaymentCancelList: svcProps,
			merchantPaymentCancel: svcProps

		};
	};
});
