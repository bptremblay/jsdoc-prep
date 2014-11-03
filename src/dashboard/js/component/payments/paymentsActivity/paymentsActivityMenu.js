define(function(require) {
    var context = null,
    	controllerChannel = require('blue/event/channel/controller');

    return {
        init: function() {
            context = this.settings.context;
        },
        requestCreditCardPaymentActivity: function() {
            controllerChannel.emit('trigger', {
                target: this,
                value: 'requestCreditCardPaymentActivity'
            });
            //Hide Payments Acitivty Selection Message
            this.output.emit('state', {
                target: this,
                value: 'hidePaymentActivitySelectionMessage'
            });

        },
        requestMortgagePaymentActivity: function() {
        },
        requestMoneyTransferActivity: function() {
        },
        exitPaymentActivity:function() {
        	context.state('/dashboard');
        }
    };
});
