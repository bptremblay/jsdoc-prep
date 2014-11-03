/**
 * @author DST SFO 2
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module component/dashboard/myProfile/mailingAddressDeleteConfirmation
 * @requires blue/event/channel/controller
 */
define(['blue/event/channel/controller'], function( controllerChannel ) {

	return {
		/**
		 * @function
		 * Sets context and controllerChannel object.
		 */
		init: function() {
			this.controllerChannel = controllerChannel;
		},

		/**
		 * @function
		 * Make address delete service call to delete address.
		 * If 'SUCCESS' call _deleteAddressSuccessCallback function.
		 * If 'FAILURE' call _deleteAddressFailureCallback function.
		 * If 'ERROR' call _deleteAddressErrorCallback function.
		 */
		deleteAddress: function(){
			this.context.controller.myProfileServices.mailingAddress['myProfile.mailingAddress.delete.svc']({
				groupId: this.model.lens('groupId').get(),
				addressId: this.model.lens('id').get()
			}).then( function(data) {
				if( data.code === 'SUCCESS' ) {
					this._deleteAddressSuccessCallback();
				} else {
					this._deleteAddressFailureCallback();
				}
			}.bind(this),
			this._deleteAddressErrorCallback.bind(this));
		},

		/**
		 * @function
		 * Emit controllerChannel event to hide delete confirmation modal.
		 */
		doNotDeleteAddress: function(){
			this.controllerChannel.emit('hideDeleteMailingAddressConfirmation', this.model.get());
		},

		/**
		 * @function
		 * Emit controllerChannel event to hide delete confirmation modal.
		 * Emit controllerChannel event to list mailing address with 'sucess' message info.
		 */
		_deleteAddressSuccessCallback: function(){
			this.controllerChannel.emit('hideDeleteMailingAddressConfirmation');
			this.controllerChannel.emit('listMailingAddress',
				this.context.controller.dataTransform.transformAddressDeletedMessage(this.model.get(), 'success'));
		},

		/**
		 * @function
		 * Emit controllerChannel event to hide delete confirmation modal.
		 * Emit controllerChannel event to list mailing address with 'failure' message info.
		 */
		_deleteAddressFailureCallback: function(){
			this.controllerChannel.emit('hideDeleteMailingAddressConfirmation');
			this.controllerChannel.emit('listMailingAddress',
				// TODO: Change failure message info when dCE finalizes approach and stories are ready for dev.
				this.context.controller.dataTransform.transformAddressDeletedMessage(this.model.get(), 'error', { title:'FAILURE', details:'DELETE SERVICE RESULUTS FAILURE' }));
		},

		/**
		 * @function
		 * Emit controllerChannel event to hide delete confirmation modal.
		 * Emit controllerChannel event to list mailing address with 'sucess' message info.
		 */
		_deleteAddressErrorCallback: function(jqXHR){
			this.controllerChannel.emit('hideDeleteMailingAddressConfirmation');
			this.controllerChannel.emit('listMailingAddress',
				// TODO: Change Error message info when dCE finalizes approach and stories are ready for dev.
				this.context.controller.dataTransform.transformAddressDeletedMessage(this.model.get(), 'error', { title: 'ADDRESS DELETE SERVICE ERROR', details: jqXHR.statusText }));
		}

	};
});
