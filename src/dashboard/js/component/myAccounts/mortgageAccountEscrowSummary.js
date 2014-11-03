define(function(require) {
    var context = null;

    return {
        init: function() {
            context = this.settings.context;
        },
        requestEscrowAnalysisAndStatement: function() {
            console.log('foo');
        }
    };
});
