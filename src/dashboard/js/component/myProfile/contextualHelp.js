define(function(require) {
	var context = null,
	controllerChannel = require('blue/event/channel/controller');

 // test commit to check CI build - TODO - remove.
	return {
		init: function() {
			context = this.settings.context;
		},
		clickAndStick: function(){
			this.model.lens('clickAndStick').set(!this.model.lens('clickAndStick').get());
			$('#'+ this.model.lens('contextualHelpId').get()).removeClass('show').toggleClass('click-and-stick');
		},
		show: function(){
			if(!this.model.lens('clickAndStick').get()) {
				$('#'+ this.model.lens('contextualHelpId').get()).addClass('show');
			}
		},
		hide: function(){
			$('#'+ this.model.lens('contextualHelpId').get()).removeClass('show');
		}
		// closeClickAndStick: function() {
		// 	//this.clickAndStick();
		// 	this.model.lens('clickAndStick').set(false);
		// 	$('#'+ this.model.lens('contextualHelpId').get()).removeClass('show click-and-stick');
		// }
	};
});

