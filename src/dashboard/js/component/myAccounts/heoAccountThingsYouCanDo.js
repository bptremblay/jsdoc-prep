define(function(require) {
    var context = null;
    //controllerChannel = require('blue/event/channel/controller');

    return {
        init: function() {
            context = this.settings.context;
        },
        requestAccountStatements: function() {},
        requestEscrowDetails: function() {},
        requestForms: function() {},
        //need to redo emit function based on new detail page for HEO account.
        requestAccountDetails: function() {
            context.appChannel.emit('getExpandedHeo', this.model.get());
        },
        requestThingsYouCanDo: function() {},
        exitThingsYouCanDo: function() {},
        updatePaymentDueDate: function() {}
    };
});
