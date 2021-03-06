/* German initialisation for the jQuery UI date picker plugin. */
/* Written by Milian Wolff (mail@milianw.de). */
YUI().add('jquery-ui-datepicker-de', function (Y) {
  jQuery(function($){
  	$.datepicker.regional['de'] = {
  		closeText: 'schließen',
  		prevText: '&#x3c;zurück',
  		nextText: 'Vor&#x3e;',
  		currentText: 'heute',
  		monthNames: ['Januar','Februar','März','April','Mai','Juni',
  		'Juli','August','September','Oktober','November','Dezember'],
  		monthNamesShort: ['Jan','Feb','Mär','Apr','Mai','Jun',
  		'Jul','Aug','Sep','Okt','Nov','Dez'],
  		dayNames: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
  		dayNamesShort: ['So','Mo','Di','Mi','Do','Fr','Sa'],
  		dayNamesMin: ['So','Mo','Di','Mi','Do','Fr','Sa'],
  		weekHeader: 'KW',
  		dateFormat: 'dd.mm.yy',
  		firstDay: 1,
  		isRTL: false,
  		showMonthAfterYear: false,
  		yearSuffix: ''};
  });

}, '0.0.1', {requires: ['jquery-ui-datepicker']});