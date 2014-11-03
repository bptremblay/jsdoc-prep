define(function(require) {

    return function rcaHeaderView() {
        this.template = require('dashboard/template/myAccounts/rcaHeader');
        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/rcaHeader'));

        this.init = function() {
            this.bridge.on('state/RCApopup', function() {
                $(".detailPopup").hide();
                $(".popupIcon").click(function() {
                    $(".detailPopup").show();
                });
                $(".icon-close").click(function() {
                    $(".detailPopup").hide();
                });
            });
        };
    };
});