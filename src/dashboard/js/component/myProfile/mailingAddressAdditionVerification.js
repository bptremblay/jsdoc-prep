define(function() {
	controllerChannel = require('blue/event/channel/controller');

	return {
		init: function() {
		},
		/**
		 * @function
		 * @param {object} eventData
		 * Transform data and make address add address service call.
		 * If 'SUCCESS' call _addAddressSuccessCallback function.
		 * If 'FAILURE' call _addAddressFailureCallback function.
		 * If 'ERROR' call _addAddressErrorCallback function.
		 */
		addAddress: function(eventData){

			var postData = this.context.controller.dataTransform.transformAddressCommitPostData(eventData.context);
			this.context.controller.myProfileServices.mailingAddress['myProfile.mailingAddress.commit.svc'](postData)
				.then(function(data){
					if(data.code === 'SUCCESS') {
			 			this._addAddressSuccessCallback(eventData.context[eventData.context.option], eventData.context.isEdit);
					} else {
						this._addAddressFailureCallback();
					}
				}.bind(this), function(jqXHR){
					this._addAddressErrorCallback();
				}.bind(this));
		},
		/**
		 * @function
		 * Emit controllerChannel event to hide verification modal.
		 */
		doNotAddAddress: function(){
			controllerChannel.emit('hideAddressAdditionVerificationModal');
		},
		/**
		 * @function
		 * Emit controllerChannel event to hide verification modal.
		 * Emit controllerChannel event to list mailing address with success message.
		 */
		_addAddressSuccessCallback: function(data, isEdit){
			controllerChannel.emit('hideAddressAdditionVerificationModal');
			controllerChannel.emit('listMailingAddress', this.context.controller.dataTransform.transformAddressAddedMessage({
				line1: data.line1, isEdit: isEdit
			}, 'success'));
		},
		/**
		 * @function
		 * Emit controllerChannel event to hide verification modal.
		 * Emit controllerChannel event to list mailing address with failure message.
		 */
		_addAddressFailureCallback: function(){
			//TODO: Handle failure
			controllerChannel.emit('hideAddressAdditionVerificationModal');
		},
		/**
		 * @function
		 * Emit controllerChannel event to hide verification modal.
		 * Emit controllerChannel event to list mailing address with error message.
		 */
		_addAddressErrorCallback: function(){
			//TODO: Handle error
			controllerChannel.emit('hideAddressAdditionVerificationModal');
		}
	};
});
