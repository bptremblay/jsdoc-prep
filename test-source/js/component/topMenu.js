define(function() {
    var context = null;

    return {
        init: function() {
            context = this.settings.context;
        },
        selectMenuItem: function() {
        	//update the active locale to this one
        	context.settings.set('language', this.locale, context.settings.Type.PERM);

        	//HACK - reload the browser to reflect locale change
        	location.reload();
        }
    };
});
