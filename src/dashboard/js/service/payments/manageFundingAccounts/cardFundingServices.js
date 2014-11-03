define(function() {
	return function cardFundingServices() {
		var svcProps = {
			settings: {

				type: 'POST',
				timeout: 20000,
				xhrFields: {
					withCredentials: true
				}
			}
		};
		var svcPropsJSON = {
			settings: {
				type: 'GET'
			}
		};

		var svcPropsVirtual = {
			settings: {
				type: 'POST',
			}
		};

		this.serviceCalls = {
            'card.funding.list': svcProps,
            'card.funding.update.list': svcProps,
            'card.funding.update': svcProps,
            'billpay.card.funding.delete': svcProps,
            'billpay.card.funding.delete.options.list': svcProps,
        };
	};
});
