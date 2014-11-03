define(function(require) {
    var context = null;

    return {
        init: function() {
            context = this.settings.context;
        },
        editAutomaticPayment: function() {
            console.log('foo');
        },
        cancelAutomaticPayment: function() {
            console.log('foo');
        },
        setupAutomaticPayments: function() {
            console.log('foo');
        }
    };
});
