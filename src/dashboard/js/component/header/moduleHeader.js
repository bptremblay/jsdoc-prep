define(function(require) {
    var context = null;

    return {
        init: function() {
            context = this.settings.context;
        },
        closeProfile: function() {
            context.state(context.settings.get('dashboardUrl'));
        }
    };
});