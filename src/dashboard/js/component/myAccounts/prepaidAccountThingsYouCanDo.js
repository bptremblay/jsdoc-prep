define(function(require) {
	var context = null

	return {
		init: function() {
			context = this.settings.context;
		},
		requestAccountStatements: function() {

		},
		requestAccountDetails: function() {
			var prepaidOwnerData = {
				accountId: this.model.lens('accountId').get(),
				accountType: this.model.lens('accountType').get(),
				accountName: this.model.lens('accountName').get(),
				accountMaskNumber: this.model.lens('accountMaskNumber').get()
			};
			context.appChannel.emit('accountDetailsPrepaid', prepaidOwnerData);
		},
		requestThingsYouCanDo: function() {
		},
		requestFormsAndDocuments: function() {
		},
		updateAccountSettingsAndPreferences: function() {
		},
		requestAccountFrequentlyAskedQuestions: function() {
		},
		exitThingsYouCanDo: function() {
		}
	};
});
