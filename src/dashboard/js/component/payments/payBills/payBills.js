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
        payBillsNext: function() {
            componentChannel.emit('trigger', {
                target: this,
                value: 'payBillsVerify'
            });
        }
    };
});