/**
 * This is the component for a search related questions.
 */
define(function(require) {
	var controllerChannel = require('blue/event/channel/controller');
	return {
		init: function() {

		},
		selectSearchRelatedQuestion: function(data){
			var searchOptionData = {
				searchOption: data.context.searchOption,
				searchOptionRecognitionID: data.context.searchOptionRecognitionID,
				searchOptionAnswerID: data.context.searchOptionAnswerID,
				searchOptionData: data.context.searchOptionData
			};
			controllerChannel.emit('selectSearchOption', {
				searchOptionData: searchOptionData
			});
		}
	};

});
