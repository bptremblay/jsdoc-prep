define(function() {
	return function mailingAddressService() {
		var svcProps = {
			settings: {
				timeout: 60000
			}
		};

		this.serviceCalls = {
			'myProfile.mailingAddress.list.svc': svcProps,
			'myProfile.mailingAddress.list.vt': svcProps,
			'myProfile.mailingAddress.delete.svc': svcProps,
			'myProfile.mailingAddress.add.validate.svc': svcProps,
			'myProfile.mailingAddress.edit.validate.svc': svcProps,
			'myProfile.mailingAddress.edit.validate.vt': svcProps,
			'myProfile.mailingAddress.commit.svc': svcProps,
			'myProfile.mailingAddress.commit.vt': svcProps,
			'myProfile.mailingAddress.addOptions.svc':svcProps,
			'myProfile.mailingAddress.addOptions.vt':svcProps,
			'myProfile.mailingAddress.editOptions.svc':svcProps,
			'myProfile.mailingAddress.editOptions.vt':svcProps,
			'myProfile.mailingAddress.stateList.svc': svcProps,
			'myProfile.mailingAddress.countryList.svc': svcProps,
			'myProfile.mailingAddress.brokerage.update.svc': svcProps,
			'myProfile.mailingAddress.brokerage.update.vt': svcProps
		};
	};
});
