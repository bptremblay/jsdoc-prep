define(function(require) {
    var context = null;
    var componentChannel = require('blue/event/channel/component');


    return {
        init: function() {
            context = this.settings.context;
        },
        payBillsClose: function() {
            context.state(context.settings.get('dashboardUrl'));
        },
        anotherPayBills: function() {

            componentChannel.emit('trigger', {
                target: this,
                value: 'payBills'
            });
        }
    };
});