define(function(require) {
    return {
        init: function() {
        },
        requestMyProfile: function() {
            this.context.controller.goURL(envConfig.PROFILE_INDEX + this.context.controller.settings.get('profileUrl'));
        },

        logOutOnlineBanking: function() {
            this.context.controller.goURL(envConfig.AUTH_INDEX + this.context.controller.settings.get('logOutUrl'));
        },
        requestMyInfoMenu: function(){
           this.output.emit('state', {
                value: 'requestMyInfoMenu'
            });
        },
        exitMyInfoMenu: function(){
              this.output.emit('state', {
                value: 'exitMyInfoMenu'
            });
        }
    };
});
