define(function() {
    var context = null;

    return {
        init: function() {
            context = this.settings.context;
        },
        showProfile: function() {
            this.output.emit('state', {
                target: this,
                value: 'toggleProfile'
            });
            this.profileUrl = envConfig.PROFILE_INDEX + context.settings.get('profileUrl');
            this.logOutUrl = envConfig.AUTH_INDEX + context.settings.get('logOutUrl');
        }
    };
});