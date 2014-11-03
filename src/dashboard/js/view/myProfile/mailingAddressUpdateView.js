define(function (require){
	return function MailingAddressUpdateView(){

		this.init = function() {
			this.bridge = this.createBridge (require('dashboard/view/webspec/myProfile/mailingAddressUpdate'));

			this.template = require('dashboard/template/myProfile/mailingAddressUpdate');

        	this.bridge.on('trigger/resetMailingAddressData', function(data){
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

		this.decorators = {
			'validator': {
				module: require('dashboard/lib/myProfile/validator/decorator')(this)
			}
		};

		this.transitions = {
			'scrollToTop': require('dashboard/lib/myProfile/transition/scrollToTop')
		};
	};
})
