define(function (require) {

    return function() {
    	var self = this;

    	var DatePickerBridge = require('blue/bridge').create(require('blue-ui/view/webspec/modules/datepicker'));
		this.bridge = new DatePickerBridge({
			targets: {
			}
		});

    	self.instanceName = 'datepicker';
    	self.type = 'view';

    	this.eventManager = {
    		click: {
    			'.trigger': function($element, event) {
    				event.preventDefault();
    				self.component.show();
    			},
    			'.calendarcell': function($element, event) {
    				event.preventDefault();
    				self.component.selectDate($element);
    			},
    			'.prev': function($element, event) {
    				event.preventDefault();
    				self.component.changeMonth($element);
    			},
    			'.next': function($element, event) {
    				event.preventDefault();
    				self.component.changeMonth($element);
    			}
    		},
    		keydown: {
    			// '.calendarcell': function($element, event) {
    			// 	//event.preventDefault();
    			// 	//self.component.dateKeydownHandler($element, event);
    			// },
    			'.trigger': function($element, event) {
    				self.component.triggerKeydownHandler($element, event);
    			}
    		},
    		focusout: {
    			// '.trigger': function($element, event) {
    			// 	//event.preventDefault();
    			// 	self.component.hide();
    			// }
    		}
    	}

    	this.init = function() {
    		setTimeout(function() {
    			this.$target.find('.jpui.calendars-container').on('keydown', '.calendarcell', function(event){
    				self.component.dateKeydownHandler($(event.target), event);
    			}).on('keydown', '.prev', function(event) {
    				self.component.prevButtonKeydownHandler($(event.target), event);
    			}).on('keydown', '.next', function(event) {
    				self.component.nextButtonKeydownHandler($(event.target), event);
    			});

    			$(document).on('click', function(event) {
    				self.component.hide();
    			});
    		}.bind(this), 2000)
    	}
    	this.template = require('blue-ui/template/modules/datepicker');
    }
});
