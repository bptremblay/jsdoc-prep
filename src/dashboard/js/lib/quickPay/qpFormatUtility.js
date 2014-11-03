define(function() {



	var formatCurrencyUtility = (function(){

		/**
		 * formatCurrency is use to format currency
		 * @function
		 * @param {number|string|null|underfine} value which is trying to format
		 * @param {number} decimalPlaces defines how many decimal places : detault is 2 places
		 * @param {string|''} thousandSeperator defines what the thousandth seperator is, default is ","
		 * @param {''|'-'|'('} negative defines if there is a negative sign
		 * @param {'$'|''|null|undefined} dollarSymbol defines if there is a symbol in front of the value
		 * @param {string} nonNumberDisplay defines if isNan then show return this string: is this is not passed, '0' zero is returned
		 * @example
		 *  sample useages
		 *  formatCurrency('82704987234024');
         *  "82,704,987,234,024.00"
		 *  formatCurrency(0);
		 *  "0.00"
		 *  formatCurrency('');
		 *  "0.00"
		 *  formatCurrency(.01);
		 *  "0.01"
		 *  formatCurrency(.01, 3);
		 *  "0.010"
		 *  formatCurrency(.01, 0);
		 *  "0"
		 *  formatCurrency(.01, 10, ',');
		 *  "0.0100000000"
		 *  formatCurrency(123456789.01, 4, ',');
		 *  "123,456,789.0100"
		 *  formatCurrency(123456789.01, 4, ',');
		 *  "123,456,789.0100"
		 *  formatCurrency(123456789.01, 4, ',', '');
		 *  "123,456,789.0100"
		 *  formatCurrency(-123456789.01, 4, ',', '');
		 *  "-123,456,789.0100"
		 *  formatCurrency(-123456789.01, 4, ',', '(');
		 *  "(123,456,789.0100)"
		 *  formatCurrency(123456789.01, 4, ',', '(');
		 *  "123,456,789.0100"
		 *  formatCurrency(123456789.01, 4, ',', '(', '$');
		 *  "$123,456,789.0100"
		 *  formatCurrency('-123456789.01', 4, ',', '', '$', '--');
		 *  "-$123,456,789.0100"
		 *  formatCurrency(-123456789.01, 4, ',', '(', '$');
		 *  "($123,456,789.0100)"
		 *  formatCurrency('-NAN', 4, ',', '(', '$');
		 *  "$0.0000"
		 *  formatCurrency('-NAN.01', 4, ',', '(', '$', '--');
		 *  "--"
		 */
		/*jshint eqnull:true */
		var formatCurrency = function(value, decimalPlaces, thousandSeperator, negative, dollarSymbol, nonNumberDisplay){
			if ( isNaN(value) && nonNumberDisplay)
			{
				return nonNumberDisplay;
			}
			var d = isNaN(decimalPlaces = Math.abs(decimalPlaces)) ? 2 : decimalPlaces,
			    period = '.',
			    t = thousandSeperator == null ? ',' : thousandSeperator,
			    n = value < 0 ? (negative == null || negative === '' ? '-' : '(') : '',
			    i = parseInt(value = Math.abs(+value || 0).toFixed(d)) + '',
			    j = (j = i.length) > 3 ? j % 3 : 0;
		   return n + (dollarSymbol == null || dollarSymbol === '' ? '' : dollarSymbol) + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t)+ (d ? period + Math.abs(value - i).toFixed(d).slice(2) : '') + (n === '(' ? ')' : '');
		 };

		var formatAmount = function(amount) {
			return parseFloat(Math.round(amount * 100) / 100).toFixed(2);
		};

		return {
			formatCurrency: formatCurrency,
			formatAmount: formatAmount
		};

	})();



	var formatDateUtility = (function(){

		var formatDate = function(date){
			var year = date.getFullYear();
			var month = (1 + date.getMonth()).toString();
			month = month.length > 1 ? month : '0' + month;
			var day = date.getDate().toString();
			day = day.length > 1 ? day : '0' + day;
			return month + '/' + day + '/' + year;
		};

		var formatServiceDate = function(serviceDate){
			var year = serviceDate.substring(0,4);
			var month = serviceDate.substring(4,6);
			var day = serviceDate.substring(6,8);
			return month + '/' + day + '/' + year;
		};

		var formatServiceDateToDashedYearMonthDay = function(serviceDate){
			var year = serviceDate.substring(0,4);
			var month = serviceDate.substring(4,6);
			var day = serviceDate.substring(6,8);
			return year + '-' + month + '-' + day;
		};

		var formatDashedYearMonthDayToSlashedMonthDayYear = function(dashedDate){
			var parts = dashedDate.split('-');
			var year = parts[0];
			var month = parts[1];
			var day = parts[2];
			return month + '/' + day + '/' + year;
		};
		var formatDateForServiceInput = function(date){
			var month = date.substring(0,2);
			var day = date.substring(3,5);
			var year = date.substring(6,10);
			return year + month + day;
		};

		//Formats the given dateString {12/31/2014} in {MMM DD, YYYY} format - e.g. {Dec 31, 2014}
		var formateDateMonthDayYear= function(dateString) {
			var dObj = new Date(dateString);
			var month ;
			switch(dObj.getMonth()){
				case 0 : month = 'Jan'; break;
				case 1 : month = 'Feb'; break;
				case 2 : month = 'Mar'; break;
				case 3 : month = 'Apr'; break;
				case 4 : month = 'May'; break;
				case 5 : month = 'Jun'; break;
				case 6 : month = 'Jul'; break;
				case 7 : month = 'Aug'; break;
				case 8 : month = 'Sep'; break;
				case 9 : month = 'Oct'; break;
				case 10 : month = 'Nov'; break;
				case 11 : month = 'Dec'; break;
			}
			return month + ' ' + dObj.getDate() + ', ' + dObj.getFullYear();
		};
		return {
			formatDate: formatDate,
			formatServiceDate: formatServiceDate,
			formatDateForServiceInput: formatDateForServiceInput,
			formateDateMonthDayYear : formateDateMonthDayYear,
			formatServiceDateToDashedYearMonthDay: formatServiceDateToDashedYearMonthDay,
			formatDashedYearMonthDayToSlashedMonthDayYear:formatDashedYearMonthDayToSlashedMonthDayYear
		};

	})();

	var formatStringUtility = (function(){

		/**
		 * This function emulates wraps the text at a certain lenght.
		 * It takes four arguments:
		 *
		 * @param {string}  str: The string to be wrapped.
		 * @param {int}  	width: The column width (a number, default: 40)
		 * @param {string}  brk: The character(s) to be inserted at every break. (default: ‘\n’)
		 * @param {Boolean} cut: If the cut is set to TRUE, the string is always wrapped at or before the specified width
		 * @param {Boolean} addQuotes: If the addQuotes is set to TRUE, the string is surrounded with quotes
		 */
		var formatWrapText = function( str, width, brk, cut, addQuotes ) {

		    brk = brk || '\n';
		    width = width || 40;
		    cut = cut || false;

		    if (!str) { return ''; }

		    var regex = '.{1,' +width+ '}(\\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\\S+?(\\s|$)');

		    var result = str.match(new RegExp(regex, 'g') ).join( brk );

		    return (result && addQuotes)?'"' + result + '"' : result;

		};

		return {
			formatWrapText: formatWrapText
		};

	})();

	var formatPhoneUtility = (function(){

		var formatPhone = function(phone){
			var formattedPhone = phone;
			if (phone.length === 10){
				formattedPhone = phone.substring(0,3) + '-' + phone.substring(3,6) + '-' + phone.substring(6);
			}
			return formattedPhone;
		};

		return {
			formatPhone: formatPhone
		};

	})();

		return {

		formatDateUtility: formatDateUtility,
		formatCurrencyUtility: formatCurrencyUtility,
		formatStringUtility:formatStringUtility,
		formatPhoneUtility: formatPhoneUtility
	};

});
