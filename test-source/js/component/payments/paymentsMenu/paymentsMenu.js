define(function() {

    var context = null;

    return {
        init: function() {
            context = this.settings.context;
        },
        payBills: function() {
            context.state(context.settings.get('paymentMenuInstance').navigation['payBills'].link);
        },
        sendMoney: function() {
            context.state(context.settings.get('paymentMenuInstance').navigation['sendMoney'].link);
        },
        transferMoney: function() {
            context.state(context.settings.get('paymentMenuInstance').navigation['transferMoney'].link);
        },
        activePaymentMenuTab: function(data) {
            var navigation = this.model.get().navigation;
            this.model.lens('focused').set(true);
            for (var i in navigation) {
                if (data.menuId === i) {
                    navigation[i].active = true;
                } else {
                    navigation[i].inactive = true;
                }

            }
            this.model.lens('navigation').set(navigation);
        },
        inactivePaymentMenuTab: function() {
            var navigation = this.model.get().navigation;
            this.model.lens('focused').set(false);
            for (var i in navigation) {
                navigation[i].active = false;

                navigation[i].inactive = false;

            }
            this.model.lens('navigation').set(navigation);
        }
    };
});