define(function (require) {
	return {
		isLeapYear: function(year) {
			return (year % 4 === 0) && (year % 100 !== 0) || (year % 400 === 0);
		},
		getFirstDayOfMonth: function(month, year) {
			return new Date(year, month, 1, 0, 0, 0, 0);
		},
		getNumberOfDaysInMonth: function(month, year) {
			return [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
		},
		isTabbable: function($el) {
		    if ($el.is(":hidden") || $el.is(":disabled")) {
		        return false;
		    }

		    var tabIndex = $el.attr("tabindex");
		    tabIndex = isNaN(tabIndex) ? -1 : tabIndex;
		    return $el.is(":input, a[href], area[href], iframe") || tabIndex > -1;
		}
	}
});
