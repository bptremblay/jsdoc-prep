/**
 * @author DST SFO 2
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module dashboard/lib/transition/scrollToTop
 * Transition to scroll element on top of the page.
 **/
define(function(require) {
	
	var $ = require('blue/$');
	
	return function scrollToTopTransition(t) {
		window.scrollTo(0, $(t.element.node).offset().top -10 );
	};

});