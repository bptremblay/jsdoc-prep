define(function(require) {
    var context = null;


    return {
        init: function() {
            context = this.settings.context;
        },
        payBillsCancel: function() {
            context.state(context.settings.get('dashboardUrl'));
        },
        payBillsNext: function() {
            context.payBillsVerify();
        }
    };
});