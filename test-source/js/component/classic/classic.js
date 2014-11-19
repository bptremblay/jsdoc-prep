define(function(require) {
    var context = null;

    return {
        init: function() {
            context = this.settings.context;
        },
        updateContent: function(data) {
            context.model.lens('classicComponent.sourceUrl').set(data);
            return {};
        }
    };
});