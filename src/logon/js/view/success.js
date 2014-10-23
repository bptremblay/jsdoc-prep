/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 */
define(function(require) {
    return function SuccessView() {
        // Set up essential view settings
        this.template = require('logon/template/success');
        this.init = function() {
        	//mock implementation for remember me feature testing, user is hard coded to match
        	//the successful login user in virtual service

        	var cookieMgr = require('logon/shared/cookieManager'),
        	    expDate = new Date();

        	if (cookieMgr.readCookie('_tmprememberme') === '1') {
        		expDate.setDate(expDate.getDate() + 90);
        		document.cookie = '_rememberme=chase30user4; expires=' + expDate.toUTCString() + '; path=/';
        	}
        	else {
        		expDate.setDate(expDate.getDate() - 1);
        		document.cookie = '_rememberme=; expires=' + expDate.toUTCString() + '; path=/';
        	}
        };

        this.onDataChange = function onDataChange() {
            this.rerender();
        };
    };
});
