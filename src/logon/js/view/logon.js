/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module LogonView
 */
define(function(require) {

    return function LogonView() {
        var self = this,
            LogonBridge = this.createBridgePrototype(require('logon/view/webspec/logon'));

        self.bridge = new LogonBridge({
            targets: {
                user_id: '#userId',
                password: '#password',
                remember_my_user_id: '#rememberMe',
                logon_button: '#login-button',
                forgot_password: '#forgot_password'
            }
        });

        //TODO: Remove emit support settings as soon as possible
        self.instanceName = 'logonview';
        self.type = 'view';

        // Set up essential view settings
        this.template = require('logon/template/authForm');

        this.init = function() {
            self.bridge.on('state/valid', function(data) {
                self.updateErrorMsg(data);
            });
            self.bridge.on('state/resetform', function(data) {
                self.setUserIdPlaceholder(data);
            });
        };

        this.updateErrorMsg = function(data) {
            $('#login-error-msg').text(data.msgData);
            if (data.msgData) {
                $('#userId').focus().addClass("error");
				$('#password').addClass("error");
            } else {
				$('#userId').focus().removeClass("error");
				$('#password').removeClass("error");
			}
        };

        this.setUserIdPlaceholder = function(data) {
            $('#userId').attr('placeholder', data.placeholder);
        };

        this.onDataChange = function onDataChange() {
            this.rerender();
        };
    };
});