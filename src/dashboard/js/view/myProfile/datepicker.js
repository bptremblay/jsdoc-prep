define(function (require) {

	return function() {
		var self = this;

		var DatePickerBridge = this.createBridgePrototype(require('dashboard/view/webspec/myProfile/datepicker'));
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
				// 	console.log('keydown');
				// 	console.log(event);
				// 	//event.preventDefault();
				// 	//self.component.dateKeydownHandler($element, event);
				// },
				'.trigger': function($element, event) {
					self.component.triggerKeydownHandler($element, event);
				}
			},
			focusout: {
				// '.trigger': function($element, event) {
				// 	console.log('hey');
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
					console.log(self.component);
					self.component.prevButtonKeydownHandler($(event.target), event);
				}).on('keydown', '.next', function(event) {
					console.log(self.component);
					self.component.nextButtonKeydownHandler($(event.target), event);
				});

				$(document).on('click', function(event) {
					console.log('dom click');
					self.component.hide();
				});
			}.bind(this), 2000)
		}
		this.template = require('dashboard/template/myProfile/datepicker');
	}
});
