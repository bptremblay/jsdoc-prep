define(function(require) {
    var context = null;

    return {
        init: function() {
            context = this.settings.context;
        },
        requestAccountDetails: function() {
            context.appChannel.emit('getExpandedMortgage', this.model.get());
        },
        requestAccountStatement: function() {},
        requestForms: function() {},
        requestEscrowDetails: function() {},
        requestThingsYouCanDo: function() {},
        exitThingsYouCanDo: function() {}
    };
});
