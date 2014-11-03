define(function(require) {

    return function mortgageAccountHeaderView() {
        this.template = require('dashboard/template/myAccounts/mortgageAccountHeader');
        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/mortgageAccountHeader'));

        this.init = function() {
            this.bridge.on('state/cashBackHide', function() {
                $('#cashBack').hide();
            });

            this.bridge.on('state/autoViewPayment', function() {
                $('.automatic_payment_enrollment_status').addClass('text on');
            });

            this.bridge.on('state/paperlessView', function() {
                $('.paperless_statements_enrollment_status').addClass('text on');
            });

        };
    };
});
