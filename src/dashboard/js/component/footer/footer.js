define(function(require) {
    var context = null;

    return {
        init: function() {
            context = this.settings.context;
        },
        clickAction: function() {
            return {};
        },
        updateFooter: function(data) {
            context.model.lens('footerComponent.title').set(data);
            return {};
        }
    };
});