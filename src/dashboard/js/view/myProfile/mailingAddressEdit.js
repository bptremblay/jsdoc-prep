define(function(require) {
	return function MailingAddressEditView() {

		this.template = require('dashboard/template/myProfile/mailingAddressEdit');

		this.init = function() {
			this.bridge = this.createBridge(require('dashboard/view/webspec/myProfile/mailingAddress'));

			this.bridge.on('trigger/resetMailingAddressData', function(data) {
				this.model.city = data.city;
				this.model.state = data.state;
				this.model.country = data.country;
				this.model.postalCode = data.postalCode;
				this.model.zipCode = data.zipCode;
				this.model.zipCodeExtension = data.zipCodeExtension;
				this.model.countries = data.countries;
				this.model.states = data.states;
			}.bind(this));

		};

		var validationFunctions = [function(data) {

			var accountSelected = false;
			if (data.isPrimary) {
				accountSelected = true;
			} else if (data.addressOptions.associatedAccounts && data.addressOptions.associatedAccounts.length) {
				accountSelected = true;
			} else {
				data.addressOptions.eligibleAccounts && data.addressOptions.eligibleAccounts.forEach(function(account) {
					if (account.checked) {
						accountSelected = true;
					}
				});
			}

			if (accountSelected) {
				return {
					isValid: true
				}
			} else {
				return {
					isValid: false,
					formMessage: 'Please choose at least one account to associate with this address.'
				}
			}

		}];

		this.decorators = {
			'validator': {
				module: require('dashboard/lib/myProfile/validator/decorator')(this, validationFunctions)
			}
		};

		this.transitions = {
			'scrollToTop': require('dashboard/lib/myProfile/transition/scrollToTop')
		};
	};
})
