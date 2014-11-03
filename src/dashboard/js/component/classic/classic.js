define(function() {
    var context = null;

    return {
        init: function() {
            context = this.settings.context;
        },
        updateContent: function(data) {
            context.model.lens('classicComponent.iframeElement').set(data);
            context.model.lens('classicComponent.titleElement').set(data);
            return {};
        }
    };
});
