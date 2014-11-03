define(function(require) {

    return function helAccountHeaderView() {
        //set up essential view settings
        this.template = require('dashboard/template/myAccounts/helAccountHeader');
        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/helAccountHeader'));


        // self.bridge = new helHeaderBridge({
        //     targets: {
        //         // account_nickname: '#accountName',
        //         // account_mask_number: '#accountMask',
        //         // account_principal_balance: '#presentPrincipalBalance',
        //         // request_account_details: '',
        //         // close_account_current_balance_advisory: '',
        //         // next_payment_due_date: '',
        //         // next_automatic_payment_message: '',
        //         // next_payment_due_amount: '#nextPaymentDueAmount',
        //         // mortgage_cash_back: '#mortgageCashBack',
        //         // automatic_payment_enrollment_status: '#automaticPaymentEnrollmentStatus',
        //         // paperless_statements_enrollment_status: '#paperlessStatementsEnrollmentStatus'

        //     }
        // });



        this.init = function() {
            this.bridge.on('state/HELpopup', function() {
                $(".detailPopup").hide();
                $(".popupIcon").click(function() {
                    $(".detailPopup").show();
                });
                $(".icon-close").click(function() {
                    $(".detailPopup").hide();
                });
            });

            // this.bridge.on('state/HELpopup', function() {
            //     $('.detailPopup').hide();
            // });
            // this.eventManager = {
            //     click: {
            //         '#btn-thingsyoucando': function(e) {
            //             $('#search-main-level').toggle();
            //         }
            //     }
            // };
        };

        // this.onDataChange = function onDataChange() {
        //     this.rerender();
        // };

    };

});