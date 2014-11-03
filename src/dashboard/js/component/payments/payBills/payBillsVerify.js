define(function(require) {
    var context = null,
        componentChannel = require('blue/event/channel/component');


    return {
        init: function() {
            context = this.settings.context;
        },
        payBillsCancel: function() {
            context.state(context.settings.get('dashboardUrl'));
        },
        payBillsPrev: function() {
            componentChannel.emit('trigger', {
                target: this,
                value: 'payBills'
            });
        },
        payBillsVerify: function() {
            componentChannel.emit('trigger', {
                target: this,
                value: 'payBillsConfirm'
            });
        }
    };
});