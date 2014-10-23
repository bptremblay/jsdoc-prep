define(function (require) { // TODO: component needs to haave support for il8n
	var componentChannel = require('blue/event/channel/component'),
		Utils = require('blue-ui/component/utils'),
		context = null,
		self = null,
		getDaysOfWeek = function(length) {
			var nameLength;
			if(length) {
				nameLength = length <= 3 ? length : 2;
			} else {
				length = 2;
			}

			return [{name: "Sunday".substr(0, nameLength)},
					{name:"Monday".substr(0, nameLength)},
					{name:"Tuesday".substr(0, nameLength)},
					{name:"Wednesday".substr(0, nameLength)},
					{name:"Thursday".substr(0, nameLength)},
					{name:"Friday".substr(0, nameLength)},
					{name:"Saturday".substr(0, nameLength)}];
		},
		createCalendar = function(options, currentDate, selectedDate) {
			var date = currentDate,
					currentMonth = date.getMonth(),
					currentYear  = date.getFullYear(),
					i,
					month,
					year,
					calendarArray = [],
					monthName = ["January", "February", "March", "April",
								"May", "June", "July", "August",
								"September", "October", "November", "December"],
					nextMonthIndex,
					previousMonthIndex,
					titleYear;

			for(i = currentMonth - options.numberOfCalendars + 1; i <= currentMonth; ++i) {
				date.setMonth(i);
				month = date.getMonth();

				// Passing a negative number to setMonth moves
				// the month backwards, possibly changing the year.
				// so use the year that the calendar is on, not the current year
				if(i < 0) {
					!year && (year = date.getFullYear());
				} else {
					date.setFullYear(currentYear);
					year = currentYear;
				}

				nextMonthIndex = month + 1;
				previousMonthIndex = month - 1;
				if(month === 12) {
					nextMonthIndex = 0;
				} else if(month === 0) {
					previousMonthIndex = 11;
				}
				calendarArray.push({monthName: monthName[month],
									nextMonthName: monthName[nextMonthIndex],
									previousMonthName: monthName[previousMonthIndex],
									month: month,
									year: year,
									titleYear: titleYear,
									weeks: addDaysToCalendar(month, year, options, selectedDate)});

			}
			return calendarArray;
		},
		addDaysToCalendar = function(month, year, options, selectedDate) {
			var prevMonth = month === 0 ? 11 : month - 1,
				//date = new Date(month + "/01/" + year),
				dateString,
				days = [],
				weeks = [],
				day,
				i,
				d = Utils.getFirstDayOfMonth(month, year),
				nextMonthDayCount = 1,
				numberOfDaysInMonth = Utils.getNumberOfDaysInMonth(month, year),
				numberOfDaysInPrevMonth = Utils.getNumberOfDaysInMonth(prevMonth, year),
				dateClassNames = '',
				date,
				isDateSelected = false,
				tabIndex = -1;

			// Get days from previous month to fill in days
			// for first row of calendar
			for(i = 0; i < 7; ++i) {
				// fill in whole first row with days from previous month
				// if first day of month is on a Sunday
				if(d.getDay() === 0) {
					days.push({className: "other-month",
								dataAttr: "",
								day: numberOfDaysInPrevMonth - 6 + i
							});
				} else {
					// add days from previous month up to first day of current month
					(i < d.getDay()) && (days.push({
											className: "other-month",
											dataAttr: "",
											day: numberOfDaysInPrevMonth - d.getDay() + 1 + i
										}));
				}
			}

			// add complete 7 days to weeks array
			if(days.length === 7) {
				weeks.push({days: days});
				days = [];
			}

			for(i = 1; i <= numberOfDaysInMonth; ++i) {
				day = d.getDay();

				// Add leading zero to digits
				dateString = (month < 9 ? "0" : "") + ((month + 1)) + "/" +
							(i < 10 ? "0" : "") + i + "/" +
							year;

				date = new Date(year, month, i);
				isDateSelected = selectedDate.toDateString() === date.toDateString();
				dateClassNames = options.calendarDateClassName +  (isDateSelected ? ' selected' : '');
				tabIndex = isDateSelected ? 0 : -1;

				days.push({
					className: dateClassNames,
					dataAttr: dateString,
					day: i,
					tabIndex: tabIndex,
					index: i - 1
				});

				// Add days to week every seven days
				if(((day + 1) % 7) === 0) {
					weeks.push({days: days});
					days = [];
				}
				d.setDate(i+1);
			}


			// fill in days from next month
			// when current month ends before or
			// on Saturday, the last day in a calendar row
			for(i = day; i < 6; ++i) {
				days.push({
					className: "other-month",
					dataAttr: "",
					day: nextMonthDayCount++
				});
			}

			// Add days to array of weeks if there were days to add
			(days.length) && (weeks.push({days: days}));
			days = [];
			i = 0;

			// fill days from next month -
			// when there are less than 6 weeks in calendar
			while(i < 7 && weeks.length < 6) {
				days.push({
					className: "other-month",
					dataAttr: "",
					day: nextMonthDayCount++
				});
				++i;
			}
			weeks.push({days: days});
			return weeks;
		},
		createCalendarModel = function(options, currentDate, selectedDate) {
			var model = {},
				calendars = createCalendar(options, currentDate, selectedDate);
			model.calendars = calendars;
			model.daysOfWeek = getDaysOfWeek(options.dayFormat);
			model.lastCalendar = calendars[calendars.length - 1];
			return model;
		}

	return {
		init: function() {
			var model = this.model.get(),
				options = model.options,
				defaultOptions = {
					numberOfCalendars: 1,
					allowFutureDates: true,
					dayFormat: 2,
					calendarContainerSelector: ".calendars-container",
					calendarSelector: "table.jpui.calendar",
					calendarDateClassName: "calendarcell",
					datePickerSelector: "div.jpui.datepicker",
					datePickerNextSelector: ".jpjs.next",
					datePickerPrevSelector: ".jpjs.prev",
					datePickerYearSelector: ".jpui.year"
				};
			model.options = $.extend({}, defaultOptions, options);
			model.selectedDate = new Date();
			model.currentDate = new Date();
            !model.calendarTemplate && (model.calendarTemplate = require('blue-ui/template/modules/calendar'));
			this.model.set(model);
			context = this.settings.context;
		},
		show: function() {
			var model = this.model.get(),
				$container = $('#' + model.datepickerId),
				options = model.options,
				templateData = createCalendarModel(options, model.selectedDate, model.selectedDate);
				today = new Date();

			model.lastCalendar = templateData.lastCalendar;
			this.model.set(model);
			$container.addClass('show')
					  .find(options.calendarContainerSelector)
					  .html(model.calendarTemplate(templateData))
					  .show();
			$container.find('.hidden-header').focus();
		},
		hide: function() {
			var model = this.model.get(),
				options = model.options;
			$('#' + model.datepickerId).removeClass('show').find(options.calendarContainerSelector).hide();
		},
		toggle: function() {
			$('#' + this.model.get().datepickerId).toggleClass('show');
		},
		changeMonth: function($target, numberOfMonths) {
			if($target) {
				var numberOfMonths = $target.data('monthstomove')
			}
			var model = this.model.get(),
				options = model.options,
				date = model.currentDate,
				$container = $('#' + model.datepickerId),
				today = new Date(),
				last = model.lastCalendar,
				allowFutureDates = options.allowFutureDates,
				isFuture = last.month === today.getMonth() && last.year === today.getFullYear(),
				isForward = numberOfMonths > 0,
				templateData;


			date.setMonth(date.getMonth() + numberOfMonths);

			if($target) {
				date.setDate(1);
				if($target.hasClass('prev')) {
					targetSelector = 'a.prev';
				} else {
					targetSelector = 'a.next';
				}

			}

			model.currentDate = date;

			if(allowFutureDates || !isFuture || !isForward) {
				templateData = createCalendarModel(options, model.currentDate, date);
				model.lastCalendar = templateData.lastCalendar;
				$container.find(options.calendarContainerSelector)
					  	  .html(model.calendarTemplate(templateData));
				this.model.set(model);

				$target && $container.find(targetSelector).focus();
			}

		},
		selectDate: function($target) {
			var model = this.model.get();
			model.selectedDate = new Date($target.data("date"));
			$('#' + this.model.get().inputId).val($target.data("date")).focus();
			this.model.set(model);
			this.hide();
		},
		dateKeydownHandler: function($target, event) {
			var keycode = event.keyCode,
    			delta   = 0,
    			model = this.model.get(),
    			options = model.options,
    			$container = $('#' + model.datepickerId),
    			$selectedDate = $container.find('td.selected'),
    			selectedIndex = $selectedDate.data('index'),
    			$calendar = $selectedDate.parents('table'),
    			$tableCells = $calendar.find('.' + model.options.calendarDateClassName),
    			newSelectedIndex,
    			templateData,
    			$prevButton,
    			$nextButton,
    			isPrevTabbable,
    			isNextTabbable;

    		if(keycode >= 37 && keycode <= 40) {
    			event.preventDefault();
    			switch(keycode) {
    				case 37:
    					delta = -1;
    					break;
    				case 38:
    					delta = -7;
    					break;
    				case 39:
    					delta = 1;
    					break;
    				case 40:
    					delta = 7;
    					break;
    				default:
    					delta = 0;
    					break;
    			}

    			newSelectedIndex = selectedIndex + delta;

				if(newSelectedIndex >= 0 && newSelectedIndex < $tableCells.length) {
					$selectedDate.removeClass('selected').attr('tabindex', -1);
					$($tableCells.get(newSelectedIndex)).addClass('selected').focus().attr('tabindex', 0);
				} else if(newSelectedIndex < 0) {
					this.changeMonth(null, -1);
					// set selected here
					$calendar = $container.find(options.calendarSelector);
					$calendar.find('td.selected').removeClass('selected').attr('tabindex', -1);
					$tableCells = $calendar.find('.' + model.options.calendarDateClassName);
					$($tableCells[$tableCells.length - 1 + delta]).addClass('selected').focus().attr('tabindex', 0);
				} else if(newSelectedIndex >= $tableCells.length) {
					this.changeMonth(null, 1);
					// set selected here
					$calendar = $container.find(options.calendarSelector);
					$calendar.find('td.selected').removeClass('selected').attr('tabindex', -1);
					$tableCells = $calendar.find('.' + model.options.calendarDateClassName);
					$($tableCells[delta]).addClass('selected').focus().attr('tabindex', 0);
				}
	    	} else if(keycode === 13) { // enter
	    		event.preventDefault();
				this.selectDate($target);
			} else if(keycode === 27) { // escape
				event.preventDefault();
				this.hide();
			} else if(event.keyCode === 9) {
				// if you tab out of calendar - hide calendar and focus on icon  same with shift tab

				if(event.shiftKey) {
					$prevButton = $container.find('.prev');
					$nextButton = $container.find('.next');
					isPrevTabbable = Utils.isTabbable($prevButton);
					isNextTabbable = Utils.isTabbable($nextButton);

					if(!isNextTabbable && !isPrevTabbable) {
						this.hide();
					}
				} else {
					this.hide();
				}
			}
		},
		triggerKeydownHandler: function($target, event) {
			event.keyCode === 13 && this.show();
		},
		nextButtonKeydownHandler: function($target, event) {
			var model = this.model.get();
				$prevButton = $('#' + model.datepickerId).find('.prev');
			if(event.keyCode === 9) {
				if(event.shiftKey) {
					!Utils.isTabbable($prevButton) && this.hide();
				}
			}
		},
		prevButtonKeydownHandler: function($target, event) {
			if(event.keyCode === 9) {
				if(event.shiftKey) {
					this.hide();
				}
			}
		}
	}
});
