define(function(require) {
	var context = null,
	controllerChannel = require('blue/event/channel/controller');

	return {
		init: function() {
			context = this.settings.context;
		},
		show: function(){
			var $container = $('#'+ this.model.lens('dropdownId').get());
			$container.addClass('show').find('.option').first().addClass('has-focus').focus();
		},
		hide: function(){
			$('#'+ this.model.lens('dropdownId').get()).removeClass('show').find('.has-focus').removeClass('has-focus');
		},
		toggle: function() {
			if($('#'+ this.model.lens('dropdownId').get()).find('.list').is(':visible')) {
				this.hide();
			} else {
				this.show();
			}
		},
		optionClick: function(eventData) {
			this.hide();
			controllerChannel.emit('showAddMailingAddressForm', { address: { mailingAddressCategory: eventData.context.name }});
		},
		optionKeydown: function(eventData) {
			var $container = $('#'+ this.model.lens('dropdownId').get()),
				event = eventData.domEvent,
				$focusedItem = $container.find('.has-focus'),
				$itemsList = $container.find('.option');

			switch(event.keyCode) {
				case 40: //down arrow key
					event.preventDefault();
					if($focusedItem[0] !== $itemsList[$itemsList.length - 1]) {
						$focusedItem.removeClass('has-focus').next().addClass('has-focus').focus();
					} else {
						this.hide();
						$container.find('.js-trigger').focus();
					}
					break;
				case 38: // up arrow key
					event.preventDefault();
					if($focusedItem[0] !== $itemsList[0]) {
						$focusedItem.removeClass('has-focus').prev().addClass('has-focus').focus();
					} else {
						this.hide();
						$container.find('.js-trigger').focus();
					}
					break;
				case 9: // tab
					event.preventDefault();
					this.hide();
					$container.find('.js-trigger').focus();
					break;
				case 27: // escape
					event.preventDefault();
					this.hide();
					$container.find('.js-trigger').focus();
					break;
				case 13: // enter key
					event.preventDefault();
					this.optionClick(eventData);
				default:
					break;
			}
		},
		triggerKeydown: function(eventData) {
			var event = eventData.domEvent,
				$container = $('#'+ this.model.lens('dropdownId').get()),
				$itemsList = $container.find('.option');

			switch(event.keyCode) {
				case 13: // enter key
					event.preventDefault();
					this.show();
					break;
				case 32: // space bar
					event.preventDefault();
					this.show();
					break;
				default:
					break;
			}
		}
	};
});

