define(function(require){

	var context = null, validate = null;

	return {
		init: function() {
			context = this.settings.context;
			validate = this.settings.validate;
		}
 	};
 });
