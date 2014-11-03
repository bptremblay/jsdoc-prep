define(function(require) {


    return {
        init: function() {

        },
        topMenuNavigation: function() {
            //emit does not work when we go anf come back from classic.
            // this.output.emit('state', {
            //     value: 'showMegaMenu'
            // });
            $('body').toggleClass('hidden-menu');
        },
        everydayLivingClick: function() {
            this.context.controller.state('/dashboard');
        },
        investmentsClick: function() {
            this.context.controller.state('/dashboard/classicInvestments/index/investmenttab');
        },
        goalsClick: function() {
            this.context.controller.state('/goals');
        }
    };
});
