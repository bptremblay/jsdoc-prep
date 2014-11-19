define(function() {
    var context = null;
    return {
        init: function() {
            context = this.settings.context;
        },
        topMenuNavigation: function() {
            // context.state(data);
        },
        everydayLivingClick: function() {
            context.state('/dashboard');
        },
        investmentsClick: function() {
            context.state('/dashboard/classic/index/investmenttab');
        },
        goalsClick: function() {
            context.state('/goals');
        },
        enableMegaMenu: function() {
            this.output.emit('state', {
                target: this,
                value: 'toggleMegaMenu'
            });
        }
    };
});