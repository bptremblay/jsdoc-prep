define(function() {
    var context = null;

    return {
        init: function() {
            context = this.settings.context;
        },
        showDetails: function(data) {
            context.setProfileContent(data.context.domId);
        }
    };
});