define(function(require) {
    var context = null;


    return {
        init: function() {
            context = this.settings.context;
        },
        payBillsClose: function() {
            context.state(context.settings.get('dashboardUrl'));
        },
        anotherPayBills: function() {
            context.index(['payBills']);
        }
    };
});