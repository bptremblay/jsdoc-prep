define(function(require) {
    var context = null;
    var exports = {
        init : function() {
            context = this.settings.context;
        },
        list : function(inputData) {
            context.model.lens(inputData.model).set(inputData.data);
        },
        selectTransactionDetails : function() {

        }
    };
    return exports;
});