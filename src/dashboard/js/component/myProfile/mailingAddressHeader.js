define(function() {
	var context = null,
	controllerChannel = require('blue/event/channel/controller');

	return {
		init: function() {
		},
		addPermanentMailingAddress: function(){
			controllerChannel.emit('addMailingAddressPermanent');
		},
		addTemporaryMailingAddress: function(){
			controllerChannel.emit('addMailingAddressTemporary');
		}
	};
});
