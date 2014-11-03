define(function(require) {
    var context = null;

    return {
        init: function() {
            context = this.settings.context;
        },
        requestAccountDetails: function() {
            context.appChannel.emit('getExpandedHeloc', this.model.get());
        },
        requestThingsYouCanDo: function() {},
        exitThingsYouCanDo: function() {},
        updatePaymentDueDate: function() {
        	context.appChannel.emit('getUpdatePaymentDueDateBegin', this.model.get());
        }
    };
});
