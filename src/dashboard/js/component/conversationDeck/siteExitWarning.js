/**
 * This is the component for Site Exit Warning.
 */
define(function() {

	return {

		init: function() {
			this.output.emit('state', {
				value: 'showSiteExitMessage'
			});
		},
		proceedToExternalSite: function() {
			var model = this.model.get();

			window.open(model.externalURL, "_blank");
			this.destroySiteExitWarning();
		},
		doNotProceedToExternalSite: function() {
			this.destroySiteExitWarning();
		},
		destroySiteExitWarning: function() {
			this.output.emit('state', {
				value: 'hideSiteExitMessage'
			});
			this.destroy();
		}
	};
});
