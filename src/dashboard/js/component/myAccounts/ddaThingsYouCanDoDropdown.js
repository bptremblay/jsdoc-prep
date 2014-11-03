define(function(require) {
	var context = null;

	return {
		init: function() {
			context = this.settings.context;
		},
		requestThingsYouCanDo: function() {
		},
		exitThingsYouCanDo: function() {
		},
		requestAccountDetails: function() {
		},
    	requestAccountStatements: function() {
    	},
    	requestAccountServicesDetails: function() {
    	},
    	requestFormsAndDocuments: function() {
    	},
    	updateOverdraftProtectionServiceSettings: function() {
    	},
    	updateDebitCardCoverageSettings: function() {
    	},
    	updateOverdraftAlertsSettings: function() {
    	},
    	requestAccountFaqs: function() {
    	},
    	updateAccountSettingsAndPreferences: function() {
    	}
	};
});
