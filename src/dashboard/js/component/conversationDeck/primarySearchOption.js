/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module PrimarySearchOptionComponent
 * @description component action methods for primarySearchOption
 */

define(function(require) {

		var controllerChannel = require('blue/event/channel/controller');


	return {
		init: function() {
			this._focusFlag = true;
		},

		/**
		 * @function selectSearchResult
		 * @description Emits a message for the controller to get search result
		 * @return {none}
		 */
		selectSearchOption: function(data){
			var searchOptionData = {
				searchOption: data.context.searchOption,
				searchOptionRecognitionID: data.context.searchOptionRecognitionID,
				searchOptionAnswerID: data.context.searchOptionAnswerID,
				searchOptionData: data.context.searchOptionData
			};
			controllerChannel.emit('selectSearchOption', {
				searchOptionData: searchOptionData
			});
		},

		/**
		 * @function hideSearchOptions
		 * @description Handles focus
		 * @param {Object} data Event Object
		 */
		hideSearchOptions: function(data){
			if(data.domEvent.type === 'keydown'){
				if(data.domEvent.shiftKey && data.domEvent.keyCode === 9){
					if((Number(data.dataPath.split('.')[1]) === (this.searchOptions.length-1))){
						this._focusFlag = false;
					}
				}else if(data.domEvent.keyCode === 27){
					controllerChannel.emit('hideSearchOptions', {escapeKeyPressed: true});
				}
			}else if(data.domEvent.type === 'blur'){
				if((Number(data.dataPath.split('.')[1]) === (this.searchOptions.length-1))){
					if(this._focusFlag){
						controllerChannel.emit('hideSearchOptions', {});
					}
					this._focusFlag = true;
				}
			}
		}

	};
});
