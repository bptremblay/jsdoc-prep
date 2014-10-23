define(function(require) {

    return function MfaOptionsView() {
        var self = this,
            MfaOptionsBridge = this.createBridgePrototype(require('logon/view/webspec/mfaOptions'));

        self.bridge = new MfaOptionsBridge({
            targets: {
                deviceoption: 'input[name="deviceoption"]',
                request_identification_code: '#request_identification_code',
                exit_identification: '#exit_identification',
                provide_identification_code: '#provide_identification_code',
                request_identification_code_by_call: 'input[name="deviceoption"]'
            }
        });

        //TODO: Remove emit support settings as soon as possible
        self.instanceName = 'mfaoptionsview';
        self.type = 'view';

        // Set up essential view settings
        this.template = require('logon/template/mfaOptions');

        this.init = function() {

            self.bridge.on('state/nocode', function(data) {
                self.showInvalidCodeMessage(data);
            });

            self.bridge.on('state/contactinfo', function(data) {
                self.showContactInfo(data);
            });

        };

        this.eventManager = {
            click: {
                'div.trigger': function(e) {
                    var el = e.closest('div.flyout').find('div.content');
                    el.addClass('active');
                    el.find('i.fa-times').focus();
                },
                'i.fa-times': function(e) {
                    e.closest('div.content').removeClass('active');
                }
            }
        };

        this.showInvalidCodeMessage = function(data) {
            var $errMsg = $('#identification-code-error-msg');
            if (data.msgData && data.msgData.length > 0) {
                $errMsg.removeClass('hidden');
                $errMsg.html(data.msgData);
            } else {
                $errMsg.addClass('hidden');
                $errMsg.html('');
            }
        };

        this.showContactInfo = function(data) {
        	var $contactInfo = $('#contactInfo');
            if (data && data.show) {
                $contactInfo.removeClass('hidden');
            } else {
                $contactInfo.addClass('hidden');
            }
        };


        this.onDataChange = function onDataChange() {
            this.rerender();
        };

    };
});
