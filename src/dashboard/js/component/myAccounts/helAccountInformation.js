define(function(require) {

    var context = null;

    return {
        init: function() {
            context = this.settings.context;
        },
        updatePaymentDueDate: function() {
        	context.appChannel.emit('getUpdatePaymentDueDateBegin', this.model.get());
        }
    };
});
